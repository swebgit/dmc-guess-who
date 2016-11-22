using System.Threading.Tasks;
using System.Web.Http;
using Dmc.GuessWho.Web.Engines;
using Dmc.GuessWho.Web.Interfaces;

namespace Dmc.GuessWho.Web.Api
{
    [RoutePrefix("api/employees")]
    public class EmployeeController : ApiController
    {
        private IEmployeeEngine employeeEngine;

        public EmployeeController()
        {
            this.employeeEngine = new EmployeeEngine("https://www.dmcinfo.com/about/employee-bios");
        }

        [Route("")]
        public async Task<IHttpActionResult> Get()
        {
            var employees = await Task.Run(() => this.employeeEngine.GetEmployees()).ConfigureAwait(false);
            return this.Json(employees);
        }
    }
}