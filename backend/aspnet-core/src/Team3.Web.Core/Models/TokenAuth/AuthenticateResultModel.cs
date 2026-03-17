namespace Team3.Models.TokenAuth
{
    public class AuthenticateResultModel
    {
        public int ExpireInSeconds { get; set; }

        public long UserId { get; set; }

        public string AccessToken { get; set; }
    }
}
