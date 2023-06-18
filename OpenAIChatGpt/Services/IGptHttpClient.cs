using OpenAIChatGpt.Models;

namespace OpenAIChatGpt.Services
{
    public interface IGptHttpClient
    {
        Task<HttpResponseMessage> GetCompletion(RequestData requestData, string apiKey);
        Task<HttpResponseMessage> GetCompletionStream(RequestData requestData, string apiKey);
    }
}
