import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Bid } from '../auction/bid.entity';
import { AuctionItem } from '../auction/auction.entity';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '',
  database: 'auction',
  entities: [User, Bid, AuctionItem],
  synchronize: true,
});

async function seedUsers() {
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);

  const existingUsers = await userRepo.count();
  if (existingUsers >= 100) {
    console.log('Users already seeded.');
    process.exit(0);
  }

  const users = Array.from({ length: 100 }, (_, i) => {
    const user = new User();
    user.name = `User${i + 1}`;
    return user;
  });

  await userRepo.save(users);
  console.log('✅ Seeded 100 users.');
  process.exit(0);
}

seedUsers();