using Newtonsoft.Json;

namespace Dmc.GuessWho.Web.Dtos
{
    public class EmployeeDto
    {
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("normalImageUrl")]
        public string NormalImageUrl { get; set; }
        [JsonProperty("funImageUrl")]
        public string FunImageUrl { get; set; }
    }
}