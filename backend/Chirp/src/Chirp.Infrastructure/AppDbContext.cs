using Chirp.Application.Common;
using Chirp.Application.Common.Mapping;
using Chirp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace Chirp.Infrastructure;

public class AppDbContext : DbContext, IAppDbContext
{
    public AppDbContext(DbContextOptions options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>()
            .Property(u => u.Id)
            .ValueGeneratedNever(); // User ID comes from auth provider 
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
        modelBuilder.Entity<User>()
             .HasMany(u => u.Medias)
             .WithOne(m => m.User)
             .HasForeignKey(m => m.UserId);
        //modelBuilder.Entity<Media>()
        //    .HasOne(m => m.User)
        //    .WithMany(u => u.Medias)
        //    .HasForeignKey(m => m.UserId);

        //modelBuilder.Entity<User>()
        //    .HasOne(u => u.Avatar)
        //    .WithOne()
        //    .HasForeignKey<Media>(m => m.UserId)
        //    .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Follow>(b =>
        {
            b.HasKey(k => new { k.FollowerId, k.FollowedId });

            b.HasOne(o => o.Follower)
                .WithMany(f => f.Followings)
                .HasForeignKey(o => o.FollowerId)
                .OnDelete(DeleteBehavior.Cascade);


            b.HasOne(o => o.Followed)
                .WithMany(f => f.Followers)
                .HasForeignKey(o => o.FollowedId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Like>(b =>
        {
            b.HasKey(k => new { k.UserId, k.PostId });
        });

    }


    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.Entity is BaseEntity && (
                           e.State == EntityState.Added
                                          || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            ((BaseEntity)entityEntry.Entity).UpdatedAt = DateTime.UtcNow;

            if (entityEntry.State == EntityState.Added)
            {
                ((BaseEntity)entityEntry.Entity).CreatedAt = DateTime.UtcNow;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }

    public async Task<List<T>> ExecuteQueryAsync<T>(string sql, params object[] parameters) where T : class
    {

        var npgsqlParameters = new List<NpgsqlParameter>();

        foreach (var parameter in parameters)
        {
            if (parameter is SqlParameter sqlParameter)
            {
                // Postgres requires npgsql parameters
                npgsqlParameters.Add(new NpgsqlParameter(sqlParameter.ParameterName, sqlParameter.Value));
            }
        }
        return await Set<T>().FromSqlRaw(sql, npgsqlParameters.ToArray()).ToListAsync();
    }

    public async Task<PaginatedList<T>> ExecuteQueryAsync<T>(string sql, int pageNumber, int pageSize, params object[] parameters) where T : class
    {
        var npgsqlParameters = new List<NpgsqlParameter>();

        foreach (var parameter in parameters)
        {
            if (parameter is SqlParameter sqlParameter)
            {
                // Postgres requires npgsql parameters
                npgsqlParameters.Add(new NpgsqlParameter(sqlParameter.ParameterName, sqlParameter.Value));
            }
        }

        var query = Set<T>().FromSqlRaw(sql, npgsqlParameters.ToArray());
        return await query.PaginatedListAsync(pageNumber, pageSize);
    }


    public DbSet<Follow> Follows => Set<Follow>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Media> Medias => Set<Media>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Like> Likes => Set<Like>();

}