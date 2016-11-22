namespace Dmc.GuessWho.Web.Utilities
{
    public static class XPathUtils
    {
        public static string GetContainsClassExpression(string className)
        {
            return $"contains(concat(' ', normalize-space(@class), ' '), ' {className} ')";
        }
    }
}