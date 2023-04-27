using Amazon.Polly;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using OpenAI.GPT3.Extensions;
using OpenAIChatGpt.Models;
using OpenAIChatGpt.Services;
using System.Diagnostics;
using System.Text.Json;

namespace OpenAIChatGpt.Controllers
{
    public class HomeController : Controller
    {
        //private readonly ILogger<HomeController> _logger;
        //private readonly IChatGptSevice _chatGptSevice;
        private readonly GptHttpClient _httpClient;
        private readonly IAmazonPollyservice _amazonPollyservice;
        private readonly ILogger<HomeController> _logger;//日志
        public HomeController(ILogger<HomeController> logger, IMemoryCache memoryCache, GptHttpClient httpClient, IAmazonPollyservice amazonPollyservice)
        {
            //_chatGptSevice = chatGptSevice;
            _logger = logger;
            _httpClient = httpClient;
            _amazonPollyservice = amazonPollyservice;
        }

        public IActionResult Index()
        {
            return View();
        }



        //[HttpPost]
        //public async Task    ChatStream([FromBody] RequestData requestData)
        //{

        //    var chatMessagesStream = await _httpClient.GetCompletionStream(requestData);
        //    //StreamContent streamContent = new StreamContent(chatMessagesStream);

        //    //// 设置 Content-Type 响应头
        //    //streamContent.Headers.ContentType = new MediaTypeHeaderValue("text/event-stream");

        //    //// 创建一个 HttpResponseMessage 对象，并将 StreamContent 对象设置为其 Content 属性
        //    //HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
        //    //response.Content = streamContent;

        //    //return response;

        //    //const string separator = "\n\n";

        //    // start event stream
        //   // HttpContext.Response.ContentType = "text/event-stream";
        //    //HttpContext.Response.Headers.Add("Cache-Control", "no-cache");
        //    //HttpContext.Response.Headers.Add("X-Accel-Buffering", "no");

        //    // get the existing stream object that you want to return
        //    //var existingStream = chatMessagesStream;

        //    // set the response headers correctly
        //    HttpContext.Response.ContentType = "text/event-stream";
        //    HttpContext.Response.Headers.Add("Cache-Control", "no-cache");
        //    HttpContext.Response.Headers.Add("X-Accel-Buffering", "no");

        //    //// return the stream object
        //    //return new StringContent(chatMessagesStream, "text/event-stream");

        //    //StreamContent streamContent = new StreamContent(chatMessagesStream);

        //    HttpContext.Response.Body = chatMessagesStream;


        //}

        //[HttpPost]
        //public async Task<HttpResponseMessage> ChatStream([FromBody] RequestData requestData)
        //{
        //    // 创建一个 HttpResponseMessage 对象
        //    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);

        //    // 将 Content-Type 响应头设置为 text/event-stream
        //    response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/event-stream");
        //    // 使用 PushStreamContent 类型的对象将响应内容写入输出流
        //    response.Content = new PushStreamContent(async (outputStream, httpContext, transportContext) =>
        //        {
        //        try
        //            {

        //               var  reslt =_httpClient.GetCompletionStream(requestData);


        //            //// 在这里编写发送数据的逻辑
        //            //for (int i = 0; i < 10; i++)
        //            //{
        //            //    // 编写发送的数据
        //            //    byte[] buffer = Encoding.UTF8.GetBytes($"data: Event {i}\n\n");

        //            //    // 写入响应输出流
        //            //    outputStream.Write(buffer, 0, buffer.Length);
        //            //    outputStream.Flush();

        //            //    // 模拟发送数据的间隔，单位毫秒
        //            //    Thread.Sleep(1000);
        //            //}

        //            await foreach (var item in reslt)
        //            {
        //                // 编写发送的数据
        //                byte[] buffer = Encoding.UTF8.GetBytes($"{item}\n\n");

        //                // 写入响应输出流
        //                outputStream.Write(buffer, 0, buffer.Length);
        //                outputStream.Flush();
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            // 发生异常时，在 Console 中输出错误消息
        //            Console.WriteLine(ex.Message);
        //        }
        //        finally
        //        {
        //            // 关闭输出流
        //            outputStream.Close();
        //        }
        //    });

        //    return response;
        //}



        [HttpPost]
        public async Task<IActionResult> ProxyToC([FromBody] RequestData requestData)
        {
            if (requestData == null)
            {
                _logger.LogInformation("参数没有过来");
                return Ok("empty");
            }

            // 发送向 B 的内容并等待响应
            using (var bResponse = await _httpClient.GetCompletionStream(requestData))
            // 将响应数据作为异步流发送到客户端
            using (var bStream = await bResponse.Content.ReadAsStreamAsync())
            {
                Response.ContentType = "text/event-stream";

                var writer = new StreamWriter(Response.Body);

                var sseReader = new StreamReader(bStream);
                while (!sseReader.EndOfStream)
                {
                    var line = await sseReader.ReadLineAsync();
                    _logger.LogInformation(line);
                    if (string.IsNullOrEmpty(line))
                        continue;
                    if (line.Contains("assistant"))
                        continue;
                    line = line.RemoveIfStartWith("data: ");

                    // Exit the loop if the stream is done
                    if (line.StartsWith("[DONE]"))
                    {
                        break;
                    }
                    ChatCompletionChunk? block;
                    try
                    {
                        // When the response is good, each line is a serializable CompletionCreateRequest
                        block = JsonSerializer.Deserialize<ChatCompletionChunk>(line);


                        //throw new Exception("kong");

                    }
                    catch (Exception ex)
                    {
                        // When the API returns an error, it does not come back as a block, it returns a single character of text ("{").
                        // In this instance, read through the rest of the response, which should be a complete object to parse.
                        line += await sseReader.ReadToEndAsync();
                        block = JsonSerializer.Deserialize<ChatCompletionChunk>(line);
                        _logger.LogInformation(ex.ToString());
                    }
                    //_logger.LogInformation(line);
                    if (null != block)
                    {
                        // yield return block;
                        _logger.LogInformation(block.choices[0].delta.content);
                        await writer.WriteLineAsync(block.choices[0].delta.content);
                        await writer.FlushAsync();
                    }

                }

                await Response.Body.FlushAsync();
            }

            return new EmptyResult();
        }


        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public async Task<IActionResult> GetPollyBaseStr(string content, string polly)
        {
            //string str = "uuuu-qq-mm";
            string[] arr = polly.Split('-');
            string cdoe = arr[0] + "-" + arr[1];
            LanguageCode languageCode = new LanguageCode(cdoe);
            VoiceId voiceId = new VoiceId(arr[2]);
            string ssmlMarks = $"<speak>{content}</speak>";
            //VoiceId = "";
            _logger.LogInformation(content);
            Stopwatch sw1 = new Stopwatch();
            sw1.Start();
            var audioBytes = await _amazonPollyservice.Speak(ssmlMarks, voiceId, languageCode);
            sw1.Stop();
            _logger.LogInformation($"assisant voice耗时：{sw1.Elapsed.Seconds}s.");
            string base64String = Convert.ToBase64String(audioBytes);

            //_logger.LogInformation("data:audio/mpeg;base64," + base64String);
            return Json("data:audio/mpeg;base64," + base64String);

        }

        [HttpPost]
        public async Task<IActionResult> GetChatNormal()
        {
            try
            {
                using (var reader = new StreamReader(Request.Body))
                {
                    var json = await reader.ReadToEndAsync();
                    var items = JsonSerializer.Deserialize<List<RequestData>>(json);
                    var result = await _httpClient.GetCompletion(items[0]);
                    // Do something with the items...
        
                    return Json(result);

                }

            }
            catch (Exception ex)
            {
                _logger.LogError($"Args:{ex.ToString()}");
                return Error();
            }

        }
        public async Task<IActionResult> GetPollyVoice()
        {

            var dict = await _amazonPollyservice.GetVoices();
            return Json(dict);

        }

    }
}