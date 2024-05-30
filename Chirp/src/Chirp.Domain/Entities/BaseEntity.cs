namespace Chirp.Domain.Entities;

public abstract class BaseEntity<TId> : BaseEntity
{
    public TId Id { get; set; }

}

public abstract class BaseEntity
{
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}