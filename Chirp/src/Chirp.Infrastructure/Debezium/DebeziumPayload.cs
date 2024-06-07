using Newtonsoft.Json.Linq;

namespace Chirp.Infrastructure.Debezium
{
    public class DebeziumPayload
    {
        public ChangeData Payload { get; set; }
    }

    public class ChangeData
    {
        public JObject? Before { get; set; }
        public JObject? After { get; set; }
        public string Op { get; set; }
        public Source Source { get; set; }
    }

    public class Source
    {
        public string Version { get; set; }
        public string Connector { get; set; }
        public string Name { get; set; }
        public long Ts_ms { get; set; }
        public string Snapshot { get; set; }
        public string Db { get; set; }
        public string Sequence { get; set; }
        public string Schema { get; set; }
        public string Table { get; set; }
        public int TxId { get; set; }
        public int Lsn { get; set; }
        public object Xmin { get; set; }
    }
}
