namespace Chirp.Application.Common
{
    public class SqlParameter
    {

        public string ParameterName { get; set; }
        public object Value { get; set; }

        public SqlParameter(string parameterName, object value)
        {
            ParameterName = parameterName;
            Value = value;
        }
    }
}
