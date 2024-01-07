using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Travelist.Models;

namespace Travelist.Data
{
    public class AppDbContext: DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public static void EnsureMigrated(AppDbContext context)
        {
            if (context.Database.GetPendingMigrations().Any())
            {
                context.Database.Migrate();
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
                .HasKey(user => user.Id);
            modelBuilder.Entity<User>()
                .HasIndex(user => user.Email)
                .IsUnique();
            modelBuilder.Entity<User>()
                .HasIndex(user => user.Username)
                .IsUnique();

            modelBuilder.Entity<TravelEntity>()
                .HasKey(travelEntity => travelEntity.Id);
            modelBuilder.Entity<TravelEntity>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(travelEntity => travelEntity.UserId);
            modelBuilder.Entity<TravelEntity>()
                .HasIndex(travelEntity => travelEntity.City);
            modelBuilder.Entity<TravelEntity>()
                .OwnsOne(travelEntity => travelEntity.Location);
            modelBuilder.Entity<TravelEntity>()
                .Property(travelEntity => travelEntity.ItemsToPack)
                .HasConversion(ItemsToPackValueConverter, ItemsToPackValueComparer);

            modelBuilder.Entity<TravelEntityLike>()
                .HasKey(travelEntityLike => 
                new 
                { 
                    travelEntityLike.UserId, 
                    travelEntityLike.TravelEntityId 
                });
            modelBuilder.Entity<TravelEntityLike>()
                .HasOne<User>()
                .WithMany()
                .HasForeignKey(travelEntityLike => travelEntityLike.UserId)
                .OnDelete(DeleteBehavior.ClientCascade);
            modelBuilder.Entity<TravelEntityLike>()
                .HasOne<TravelEntity>()
                .WithMany()
                .HasForeignKey(travelEntityLike => travelEntityLike.TravelEntityId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(c => c.Id); // Assuming Id is the primary key

                entity.Property(c => c.Content).HasMaxLength(300);

                entity.HasOne<User>()
                      .WithMany()
                      .HasForeignKey(c => c.UserId)
                      .OnDelete(DeleteBehavior.ClientCascade);

                entity.HasOne<TravelEntity>()
                      .WithMany()
                      .HasForeignKey(c => c.TravelEntityId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<User> Users { get; set; }
        public DbSet<TravelEntity> TravelEntities { get; set; }
        public DbSet<TravelEntityLike> TravelEntityLikes { get; set; }
        public DbSet<Comment> Comments { get; set; }


        private static readonly ValueConverter<List<string>, string> ItemsToPackValueConverter = new(
            itemsToPack => string.Join('\n', itemsToPack),
            itemsToPack => itemsToPack == string.Empty ? 
                           new List<string>() :
                           itemsToPack.Split('\n', StringSplitOptions.None).ToList());

        private static readonly ValueComparer<List<string>> ItemsToPackValueComparer = new(
            (itemsToPack1, itemsToPack2) =>
                itemsToPack1 == itemsToPack2 || 
                (itemsToPack1 != null && itemsToPack2 != null && itemsToPack1.SequenceEqual(itemsToPack2)),
            itemsToPack => itemsToPack.Aggregate(
                0, (a, v) => HashCode.Combine(a, v.GetHashCode())));
    }
}
