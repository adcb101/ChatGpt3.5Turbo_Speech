using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using OpenAI.GPT3.Interfaces;
using OpenAI.GPT3.ObjectModels;
using OpenAI.GPT3.ObjectModels.RequestModels;
using OpenAIChatGpt.Models;
using OpenAIChatGpt.Services;
using System;
using System.Diagnostics;
using static OpenAI.GPT3.ObjectModels.SharedModels.IOpenAiModels;


namespace OpenAIChatGpt.Controllers
{
    public class HomeController : Controller
    {
        //private readonly ILogger<HomeController> _logger;
        private readonly IChatGptSevice _chatGptSevice;
        private readonly ILogger<HomeController> _logger;//日志
        public HomeController(ILogger<HomeController> logger, IChatGptSevice chatGptSevice, IMemoryCache memoryCache)
        {
            _chatGptSevice = chatGptSevice;
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Chat(string role, string content, string key)
        {
            try
            {

                //string x = "ni";
                //Convert.ToInt32(x);
                
                ChatMessage chatMessage = await _chatGptSevice.ChatAsync(role, content, key);
                return Ok(chatMessage);
               
            }
            catch (Exception ex )
            {
                _logger.LogError($"Args:{ex.ToString()}");
                //_logger.LogInformation(ex.ToString());
                return Error();
            }

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
    }
}