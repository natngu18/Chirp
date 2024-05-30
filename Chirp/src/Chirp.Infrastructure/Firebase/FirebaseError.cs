namespace Chirp.Infrastructure.Firebase
{
    public class FirebaseErrorResponse
    {
        public FirebaseError Error { get; set; }
    }

    public class FirebaseError
    {
        public int Code { get; set; }
        public string Message { get; set; }
    }
}
