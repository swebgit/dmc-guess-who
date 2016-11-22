using System.Collections.Generic;
using Dmc.GuessWho.Web.Dtos;

namespace Dmc.GuessWho.Web.Interfaces
{
    public interface IEmployeeEngine
    {
        List<EmployeeDto> GetEmployees();
    }
}