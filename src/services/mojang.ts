
interface mojangData {
  name: string
  id: string
}

export async function fetchUsername(uuid: string): Promise<string> {
  const response = await fetch(`https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`);
  if (!response.ok) {
    throw new Error('Error fetching name from Mojang');
  }
  const output: mojangData = await response.json();
  return output.name;
}

export async function fetchUUID(username: string): Promise<string> {
  const response = await fetch(`https://https://api.mojang.com/users/profiles/minecraft/${username}`);
  if (!response.ok) {
    throw new Error('Error fetching UUID from Mojang');
  }
  const output: mojangData = await response.json();
  return output.id;
}