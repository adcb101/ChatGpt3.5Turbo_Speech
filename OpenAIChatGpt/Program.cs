using Amazon;
using Amazon.Polly;
using Amazon.Runtime;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using NLog.Web;
using OpenAI.GPT3.Extensions;
using OpenAIChatGpt.Services;
using Serilog;
using Serilog.Sinks.Async;

namespace OpenAIChatGpt
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var logger = NLogBuilder.ConfigureNLog("NLog.config").GetCurrentClassLogger();
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllersWithViews();
            //builder.Services.AddOpenAIService(options =>
            //{   
            //    //options.ProviderType = ProviderType.Azure;
            //    options.ApiKey = builder.Configuration.GetSection("OpenAiKeyOption:key").Get<string>();
            //    //options.DeploymentId = "MyDeploymentId";
            //    //options.ResourceName = "MyResourceName";
            //});
           builder.Services.AddSingleton<IAmazonPollyservice>(new AmazonPollyservice(new AmazonPollyClient(new BasicAWSCredentials("", ""), RegionEndpoint.APSoutheast2)));

          
            builder.Host.UseNLog(new NLogAspNetCoreOptions { CaptureMessageTemplates = true, CaptureMessageProperties = true });
            
            //builder.Services.AddScoped<IChatGptSevice, ChatGptSevice>();
            builder.Services.AddScoped<GptHttpClient>();
            builder.Services.AddMemoryCache();
           
            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }

        
}
}