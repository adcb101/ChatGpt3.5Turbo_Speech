using Amazon;
using Amazon.Polly;
using Amazon.Polly.Model;
using Amazon.Runtime;
using Amazon.Runtime.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using OpenAI.GPT3.Extensions;
using OpenAIChatGpt.Models;
using OpenAIChatGpt.Services;
using System.Diagnostics;
using System.Linq;
using System.Net.Http.Headers;
using System.Text.Json;


namespace OpenAIChatGpt.Controllers
{
    public class ChatGptController : Controller
    {
        //private readonly ILogger<HomeController> _logger;
        //private readonly IChatGptSevice _chatGptSevice;
        private readonly IGptHttpClient _httpClient;
        private readonly IAmazonPollyservice _amazonPollyservice;
        private readonly ILogger<ChatGptController> _logger;//日志
        public ChatGptController(ILogger<ChatGptController> logger, IMemoryCache memoryCache, IGptHttpClient httpClient, IAmazonPollyservice amazonPollyservice)
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



       


        [HttpPost]
        public async Task<IActionResult> ProxyToC([FromBody] RequestData requestData)
        {    _logger.LogInformation(string.Join("////", requestData.messages.Select(p => $"{p.role}:{p.content.Replace("\r", "").Replace("\n", "")}")));
            
            if (requestData == null)
            {
                _logger.LogInformation("参数没有过来");
                return Ok("empty");
            }
            // 获取请求头
            var headers = Request.Headers;
            string accessToken = "";
            // 检查是否包含Authorization头
            if (headers.TryGetValue("Authorization", out StringValues authHeaderValue))
            {
                // 获取Bearer令牌的值
                 accessToken = authHeaderValue.FirstOrDefault();
            }
           
            // 发送向 B 的内容并等待响应
            using (var bResponse = await _httpClient.GetCompletionStream(requestData, accessToken))
            // 将响应数据作为异步流发送到客户端
            using (var bStream = await bResponse.Content.ReadAsStreamAsync())
            {
                Response.ContentType = "text/event-stream";

                var writer = new StreamWriter(Response.Body);

                var sseReader = new StreamReader(bStream);
                while (!sseReader.EndOfStream)
                {
                    var line = await sseReader.ReadLineAsync();
                    //_logger.LogInformation(line);
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
                        //_logger.LogInformation(block.choices[0].delta.content);
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
            //AmazonPollyClient amazonPollyClient = new AmazonPollyClient(new BasicAWSCredentials("AKIAQ3LXPO572L6MG4WZ", "Si3XTJT5wkd/cSYPGuO9uZsgy5m1ggZO2NZlczxm"), RegionEndpoint.APSoutheast2);
            //new AmazonPollyservice(new AmazonPollyClient(new BasicAWSCredentials("AKIAQ3LXPO572L6MG4WZ", "Si3XTJT5wkd/cSYPGuO9uZsgy5m1ggZO2NZlczxm"), RegionEndpoint.APSoutheast2))

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
                // 获取请求头
                var headers = Request.Headers;
                string accessToken = "";
                // 检查是否包含Authorization头
                if (headers.TryGetValue("Authorization", out StringValues authHeaderValue))
                {
                    // 获取Bearer令牌的值
                     accessToken = authHeaderValue.FirstOrDefault();
                }
                using (var reader = new StreamReader(Request.Body))
                {
                    var json = await reader.ReadToEndAsync();
                    var items = JsonSerializer.Deserialize<List<RequestData>>(json);
                   // _logger.LogInformation(string.Join("///", items[0].messages));
                    _logger.LogInformation(string.Join("////", items[0].messages.Select(p => $"{p.role}:{p.content.Replace("\r", "").Replace("\n", "")}")));
                    Stopwatch sw1 = new Stopwatch();
                    //AmazonPollyClient amazonPollyClient = new AmazonPollyClient(new BasicAWSCredentials("AKIAQ3LXPO572L6MG4WZ", "Si3XTJT5wkd/cSYPGuO9uZsgy5m1ggZO2NZlczxm"), RegionEndpoint.APSoutheast2);
                    //new AmazonPollyservice(new AmazonPollyClient(new BasicAWSCredentials("AKIAQ3LXPO572L6MG4WZ", "Si3XTJT5wkd/cSYPGuO9uZsgy5m1ggZO2NZlczxm"), RegionEndpoint.APSoutheast2))

                    sw1.Start();
                    var result = await _httpClient.GetCompletion(items[0], accessToken);
                    sw1.Stop();
                    _logger.LogInformation($"assisant voice耗时：{sw1.Elapsed.Seconds}s,个数{result.Length}个,平均{result.Length/sw1.Elapsed.Seconds}个");
                   
                    // Do something with the items...
                    // _logger.LogInformation);
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
            //AmazonPollyClient amazonPollyClient = new AmazonPollyClient(new BasicAWSCredentials("AKIAQ3LXPO572L6MG4WZ", "Si3XTJT5wkd/cSYPGuO9uZsgy5m1ggZO2NZlczxm"), RegionEndpoint.APSoutheast2);

            var dict = await _amazonPollyservice.GetVoices();
            return Json(dict);

        }

    }
}
