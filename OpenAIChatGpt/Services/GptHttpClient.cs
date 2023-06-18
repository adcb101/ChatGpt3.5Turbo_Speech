using Amazon.Runtime.Internal.Transform;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using OpenAI.GPT3.ObjectModels.RequestModels;
using OpenAIChatGpt.Models;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;


namespace OpenAIChatGpt.Services
{

    

    public class GptHttpClient: IGptHttpClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<GptHttpClient> _logger;
        
        public GptHttpClient(ILogger<GptHttpClient> logger )
        {
            _logger = logger;
           
           _httpClient = new HttpClient()
            {
                BaseAddress= new Uri("https://api.openai.com/v1/"),
            };

            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            

        }

        public async Task<HttpResponseMessage> GetCompletion(RequestData requestData,string apiKey)
        {
            
                string[] apikeyArr = apiKey.Split(' ');
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apikeyArr[1]);
                //requestData.max_tokens = 300;
                var responseMessage = await _httpClient.PostAsJsonAsync("chat/completions", requestData);

                //_logger.LogInformation(response.choices[0]);
                return responseMessage;
            
            
        }
        public async Task<HttpResponseMessage> GetCompletionStream(RequestData requestData,string apiKey)
        {
            
            string[] apikeyArr = apiKey.Split(' ');
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apikeyArr[1]);

            // 构建一个新的请求，代理到C后端API
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, "chat/completions");
            var jsonData = JsonSerializer.Serialize(requestData);
            var requestBody = new StringContent(jsonData, System.Text.Encoding.UTF8, "application/json");
            httpRequest.Content = requestBody;

            // 发送请求，并将响应返回给前端
            var response =await  _httpClient.SendAsync(httpRequest, HttpCompletionOption.ResponseHeadersRead);
            return response;
            
            

        }
    }

    

   
}

