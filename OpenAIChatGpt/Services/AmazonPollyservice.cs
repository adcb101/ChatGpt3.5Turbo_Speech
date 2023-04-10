﻿using Amazon.Polly.Model;
using Amazon.Polly;
using System.IO;
using Amazon.Runtime;
using Amazon;
using System.Collections.Generic;
using System;

namespace OpenAIChatGpt.Services
{
    public class AmazonPollyservice : IAmazonPollyservice
    {
        private readonly AmazonPollyClient client;


        public AmazonPollyservice(AmazonPollyClient client)
        {
            this.client = client;
            //this.voiceId = voiceId;
        }

        public async Task<byte[]> Speak(string text, VoiceId voiceId, LanguageCode languageCode)
        {
            SynthesizeSpeechRequest request = new SynthesizeSpeechRequest
            {
                // OutputFormat = OutputFormat.Mp3,
                // Text = text,
                //VoiceId = voiceId

                OutputFormat = OutputFormat.Mp3,
                TextType = TextType.Ssml,
                Text = text,
                VoiceId = voiceId.Value,    //VoiceId.Zhiyu,
                LanguageCode = languageCode.Value,//LanguageCode.CmnCN,
                Engine = "neural",
            };

            SynthesizeSpeechResponse response = await client.SynthesizeSpeechAsync(request);

            using (MemoryStream memoryStream = new MemoryStream())
            {
                response.AudioStream.CopyTo(memoryStream);
                //data:image/svg+xml;base64,
                //AudioUrl = $"data:audio/mpeg;base64,{Convert.ToBase64String(memoryStream.ToArray())}";
                //await memoryStream.CopyToAsync(fileStream);
                return memoryStream.ToArray();
            }
        }

        public async Task<List<PollyLanguage>> GetVoices() {
            //var pollyClient = new AmazonPollyClient();

            // Call DescribeVoices API to get a list of available voices
            DescribeVoicesRequest voicesRequest = new DescribeVoicesRequest();
            DescribeVoicesResponse voicesResponse = await client.DescribeVoicesAsync(voicesRequest);


            List<PollyLanguage> voiceLanguageDict = new List<PollyLanguage>();

            // Add voices and their corresponding language to the dictionary
            foreach (Voice voice in voicesResponse.Voices)
            {
                PollyLanguage pollyLanguage =new PollyLanguage() { 
                VoiceName = voice.Name,
                LanguageName= voice.LanguageName,
                LanguageCode= voice.LanguageCode,
                Gender= voice.Gender,
                };
                voiceLanguageDict.Add(pollyLanguage);
            }
            voiceLanguageDict.Sort(new PersonNameComparer());
            // Print out the list of available voices
            return voiceLanguageDict;
            //// Call DescribeLanguages API to get a list of available languages
            //DescribeLanguagesRequest languagesRequest = new DescribeLanguagesRequest();
            //DescribeLanguagesResponse languagesResponse = await client.DescribeVoicesAsync(languagesRequest);

            //// Print out the list of available languages
            //Console.WriteLine("Available languages:");
            //foreach (Language language in languagesResponse.Languages)
            //{
            //    Console.WriteLine("- " + language.LanguageName);
            //}

            //Console.ReadLine();
        }


       

    }
    public class PollyLanguage {
        public string LanguageName { get; set; }
        public string  VoiceName { get; set; }
        public string LanguageCode { get; set; }
        public string Gender { get; set; }
    }

    class PersonNameComparer : IComparer<PollyLanguage>
    {
        public int Compare(PollyLanguage x, PollyLanguage y)
        {
            return string.Compare(x.LanguageName, y.LanguageName);
        }
    }
}
