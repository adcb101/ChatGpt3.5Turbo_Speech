using OpenAI.GPT3.ObjectModels.RequestModels;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;


namespace OpenAIChatGpt.Services
{

    public interface IGptHttpClient
    {
        Task<Message> GetCompletion(List<ChatMessage> chatMessages);
    }

    public class GptHttpClient
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<GptHttpClient> _logger;
        public GptHttpClient(ILogger<GptHttpClient> logger)
        {
            _logger = logger;
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("https://api.openai.com/v1/");
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "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");
        }

        public async Task<string> GetCompletion(RequestData requestData)
        {
           
            var responseMessage = await _httpClient.PostAsJsonAsync("chat/completions", requestData);
            var response = await responseMessage.Content.ReadFromJsonAsync<ChatCompletion>();
           
            return response.choices[0].message.Content;
        }
        public async Task<HttpResponseMessage> GetCompletionStream(RequestData requestData)
        {
           

            // 构建一个新的请求，代理到C后端API
            var httpRequest = new HttpRequestMessage(HttpMethod.Post, "chat/completions");
            var jsonData = JsonSerializer.Serialize(requestData);
            var requestBody = new StringContent(jsonData, System.Text.Encoding.UTF8, "application/json");
            httpRequest.Content = requestBody;

            // 发送请求，并将响应返回给前端
            var response =await  _httpClient.SendAsync(httpRequest, HttpCompletionOption.ResponseHeadersRead);

            return response;


            //using var reader = new StreamReader(responseStream);
            //////Continuously read the stream until the end of it


            //while (!reader.EndOfStream)
            //{
            //    //cancellationToken.ThrowIfCancellationRequested();

            //    var line = await reader.ReadLineAsync();
            //    // Skip empty lines
            //    if (string.IsNullOrEmpty(line))
            //    {
            //        continue;
            //    }

            //    line = line.RemoveIfStartWith("data: ");

            //    // Exit the loop if the stream is done
            //    if (line.StartsWith("[DONE]"))
            //    {
            //        break;
            //    }

            //    ChatCompletionChunk? block;
            //    try
            //    {
            //        // When the response is good, each line is a serializable CompletionCreateRequest
            //        block = JsonSerializer.Deserialize<ChatCompletionChunk>(line);


            //        //throw new Exception("kong");

            //    }
            //    catch (Exception ex)
            //    {
            //        // When the API returns an error, it does not come back as a block, it returns a single character of text ("{").
            //        // In this instance, read through the rest of the response, which should be a complete object to parse.
            //        line += await reader.ReadToEndAsync();
            //        block = JsonSerializer.Deserialize<ChatCompletionChunk>(line);
            //        _logger.LogInformation(ex.ToString());
            //    }
            //    if (null != block)
            //    {
            //        yield return block;
            //    }
            //}

           

           
        }
    }

    

    public class RequestData
    {
        public List<Requestmessage> messages { get; set; } = new List<Requestmessage>();
        public string model { get; set; } = "gpt-3.5-turbo";
        public int max_tokens { get; set; } = 1000;
        public double temperature { get; set; } = 1;
        public double presence_penalty { get; set; } = 0;
        public double top_p { get; set; } = 1;
        public double frequency_penalty { get; set; } = 0;
        public bool stream { get; set; } = false;

    }
    public class Usage
    {
        public int Prompt_tokens { get; set; }
        public int Completion_tokens { get; set; }
        public int Total_tokens { get; set; }
    }

    public class Message
    {
        public string Role { get; set; }
        public string Content { get; set; }
    }

    public class Choice
    {
        public Message message { get; set; }
        public string Finish_reason { get; set; }
        public int Index { get; set; }
    }

    public record ChatCompletion
    {
        public string Id { get; set; }

        [JsonPropertyName("object")]
        public object CustomObject { get; set; }
        public int Created { get; set; }
        public string Model { get; set; }
        public Usage usage { get; set; }
        public List<Choice> choices { get; set; }
    }




    public class Delta
    {
        public string role { get; set; }
        public string content { get; set; }
    }

    public class StreamChoice
    {
        public Delta delta { get; set; }
        public int index { get; set; }
        public string finish_reason { get; set; }
    }

    public class ChatCompletionChunk
    {
        public string id { get; set; }
        [JsonPropertyName("object")]
        public string Customobject { get; set; }
        public int created { get; set; }
        public string model { get; set; }
        public List<StreamChoice> choices { get; set; }
    }

    public class Requestmessage
    {

        public string role { get; set; }
        public string content { get; set; }

    }
}

