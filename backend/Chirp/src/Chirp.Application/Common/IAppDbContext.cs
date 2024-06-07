using Chirp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Chirp.Application.Common
{
    public interface IAppDbContext
    {
        DbSet<Media> Medias { get; }
        DbSet<User> Users { get; }
        DbSet<Post> Posts { get; }
        DbSet<Follow> Follows { get; }
        DbSet<Like> Likes { get; }
        Task<int> SaveChangesAsync(CancellationToken cancellationToken);
        //Task<List<T>> ExecuteQueryAsync<T>(string sql, params object[] parameters);
        Task<List<T>> ExecuteQueryAsync<T>(string sql, params object[] parameters) where T : class;
        Task<PaginatedList<T>> ExecuteQueryAsync<T>(string sql, int pageNumber, int pageSize, params object[] parameters) where T : class;
    }
}
