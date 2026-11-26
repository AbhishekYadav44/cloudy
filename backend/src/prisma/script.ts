import { db } from "./db.js";

async function main() {
  

  const users = await db.orm.public.User.all();
  console.log("All users:", users);

  await db.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});