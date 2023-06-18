using System.Text.Json.Serialization;

namespace OpenAIChatGpt.Models
{


    public class RequestData
    {
        public List<Requestmessage> messages { get; set; } = new List<Requestmessage>();
        public string model { get; set; } = "gpt-3.5-turbo-16k";

         //public int max_tokens { get; set; } = 600;
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

