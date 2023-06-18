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
using System.Net;
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
        {

            
            if (requestData == null)
            {
                _logger.LogInformation("参数没有过来");
                return Ok("empty");
            }
            // 获取请求头
            var headers = Request.Headers;
            string? accessToken = "";
            // 检查是否包含Authorization头
            if (headers.TryGetValue("Authorization", out StringValues authHeaderValue))
                accessToken = authHeaderValue.FirstOrDefault(); // 获取Bearer令牌的值


            // 发送向 B 的内容并等待响应
            using (var bResponse = await _httpClient.GetCompletionStream(requestData, accessToken))
                try
                {
                    // 处理成功的响应
                    if (bResponse.IsSuccessStatusCode)
                    {
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
                    else
                    {
                        // 处理错误的响应401 429 500 503
                        _logger.LogInformation($"请求失败,状态码：{bResponse.StatusCode},原因：{bResponse.ReasonPhrase}");
                        return Ok(bResponse.ReasonPhrase);
                    }
                }
                catch (HttpRequestException ex)
                {
                    // 处理HTTP请求异常
                    _logger.LogInformation($"HTTP请求异常：{ex.Message}");
                    return Ok(ex.StatusCode);
                }
                catch (Exception ex)
                {
                    // 处理其他异常
                    _logger.LogInformation($"发生异常：{ex.Message}");
                    return Ok("发生异常,请重试");

                }






        }

        [HttpPost]
        public async Task<IActionResult> GetChatNormal()
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
                var response = await _httpClient.GetCompletion(items[0], accessToken);
               

                try
                {
                    if (response.IsSuccessStatusCode)
                    {
                        var result = await response.Content.ReadFromJsonAsync<ChatCompletion>();
                        return Json(result.choices[0].message.Content);
                    }
                    else
                    {
                        // 处理错误的响应
                        _logger.LogInformation($"请求失败,状态码：{response.StatusCode},原因：{response.ReasonPhrase}");
                        return Ok(response.ReasonPhrase);
                    }
                }
                catch (HttpRequestException ex)
                {
                    // 处理HTTP请求异常
                    _logger.LogInformation($"HTTP请求异常：{ex.Message}");
                    return Ok(ex.StatusCode);
                }
                catch (Exception ex)
                {
                    // 处理其他异常
                    _logger.LogInformation($"发生异常：{ex.Message}");
                    return Ok("发生异常,请重试");

                }


            }



        }
        [HttpPost]
        public async Task<IActionResult> GetPollyVoice()
        {

            var dict = await _amazonPollyservice.GetVoices();
            return Json(dict);

        }
        [HttpPost]
        public async Task<IActionResult> GetPollyBaseStr(string content, string polly)
        {
            //string str = "uuuu-qq-mm";
            string[] arr = polly.Split('-');
            string cdoe = arr[0] + "-" + arr[1];
            LanguageCode languageCode = new LanguageCode(cdoe);
            VoiceId voiceId = new VoiceId(arr[2]);
            string ssmlMarks = $"<speak>{content}</speak>";
            var audioBytes = await _amazonPollyservice.Speak(ssmlMarks, voiceId, languageCode);
            string base64String = Convert.ToBase64String(audioBytes);
            return Json("data:audio/mpeg;base64," + base64String);

        }
    }
}
