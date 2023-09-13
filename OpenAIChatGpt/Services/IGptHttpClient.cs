using OpenAI.GPT3.ObjectModels.RequestModels;
using OpenAI.GPT3.ObjectModels.ResponseModels;
using OpenAIChatGpt.Models;

namespace OpenAIChatGpt.Services
{
    public interface IGptHttpClient
    {
        Task<HttpResponseMessage> GetCompletion(RequestData requestData, string apiKey);
        Task<HttpResponseMessage> GetCompletionStream(RequestData requestData, string apiKey);
        IAsyncEnumerable<ChatCompletionCreateResponse> CreateCompletionAsStream(RequestData requestData, string apiKey, CancellationToken cancellationToken = default);

    }
}
