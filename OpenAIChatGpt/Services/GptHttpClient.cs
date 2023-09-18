
using OpenAIChatGpt.Models;
using System.Net.Http.Headers;
using System.Text.Json;
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
                BaseAddress= new Uri("https://api.openai.withlogging.com/v1/"),
            };
           
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Add("X-Api-Key", "Bearer 0dc078c6abc9987644a99ad0869148f7fc47e34e8412eab9fc7580912a5238e7");
            
          
        }

        public async Task<HttpResponseMessage> GetCompletion(RequestData requestData,string apiKey)
        {
            
                string[] apikeyArr = apiKey.Split(' ');
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apikeyArr[1]);
               _httpClient.DefaultRequestHeaders.Add("X-User-Id", $@"15179793171@163.com_{apikeyArr[1]}");
            //requestData.max_tokens = 300;
            var responseMessage = await _httpClient.PostAsJsonAsync("chat/completions", requestData);

                //_logger.LogInformation(response.choices[0]);
                return responseMessage;
            
            
        }
        public async Task<HttpResponseMessage> GetCompletionStream(RequestData requestData,string apiKey)
        {
            
            string[] apikeyArr = apiKey.Split(' ');
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apikeyArr[1]);
            _httpClient.DefaultRequestHeaders.Add("X-User-Id", $@"15179793171@163.com_{apikeyArr[1]}");

            // 构建一个新的请求，代理到C后端API
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, "chat/completions");
            var jsonData = JsonSerializer.Serialize(requestData);
            var requestBody = new StringContent(jsonData, System.Text.Encoding.UTF8, "application/json");
            httpRequest.Content = requestBody;

            // 发送请求，并将响应返回给前端
            var response =await  _httpClient.SendAsync(httpRequest, HttpCompletionOption.ResponseHeadersRead);
            return response;
            
            

        }
       /* public  async  IAsyncEnumerable<ChatCompletionCreateResponse> CreateCompletionAsStream(RequestData requestData, string apiKey,
       [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            // Mark the request as streaming
            //chatCompletionCreateRequest.Stream = true;

            // Send the request to the CompletionCreate endpoint
            //chatCompletionCreateRequest.ProcessModelId(modelId, _defaultModelId);
            string[] apikeyArr = apiKey.Split(' ');
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apikeyArr[1]);
            using var response = _httpClient.PostAsStreamAsync("https://api.openai.com/v1/chat/completions", requestData, cancellationToken);
            await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            using var reader = new StreamReader(stream);
            // Continuously read the stream until the end of it
            while (!reader.EndOfStream)
            {
                cancellationToken.ThrowIfCancellationRequested();

                var line = await reader.ReadLineAsync();
                // Skip empty lines
                if (string.IsNullOrEmpty(line))
                {
                    continue;
                }

                line = line.RemoveIfStartWith("data: ");

                // Exit the loop if the stream is done
                if (line.StartsWith("[DONE]"))
                {
                    break;
                }

                ChatCompletionCreateResponse? block;
                try
                {
                    // When the response is good, each line is a serializable CompletionCreateRequest
                    block = JsonSerializer.Deserialize<ChatCompletionCreateResponse>(line);
                }
                catch (Exception)
                {
                    // When the API returns an error, it does not come back as a block, it returns a single character of text ("{").
                    // In this instance, read through the rest of the response, which should be a complete object to parse.
                    line += await reader.ReadToEndAsync();
                    block = JsonSerializer.Deserialize<ChatCompletionCreateResponse>(line);
                }


                if (null != block)
                {
                    yield return block;
                }
            }
        }

*/
    }




}

