# ORIEN Provider Node

Quick setup for Mac Mini / compute providers.

## CLI Setup (Recommended)

```bash
# Install globally
npm install -g @orien/provider-node

# Initialize
orien-provider init --name "My Mac Studio"

# Start
orien-provider start

# Check status
orien-provider status

# List tools
orien-provider tools
```

## Manual Setup

```bash
# 1. Clone
git clone https://github.com/ValenteCreativo/ORIEN
cd ORIEN/provider-node

# 2. Install
pnpm install

# 3. Configure
cp .env.example .env
# Edit .env with your settings

# 4. Start
pnpm dev
```

## Register with ORIEN

After starting your node:
1. Go to https://orien.vercel.app/register
2. Enter your provider details
3. Connect wallet (ENS optional)
4. Start earning from agent executions

## Configuration

Edit `.env`:

```env
PROVIDER_ID=provider-xxx
PROVIDER_NAME="My Provider"
PORT=4000
COORDINATOR_URL=https://orien.vercel.app
WORKSPACE_ROOT=/tmp/orien-workspaces
```

## Adding Custom Tools

Edit `src/config.ts` to whitelist tools:

```typescript
{
  id: 'my_tool',
  name: 'My Custom Tool',
  command: 'my-command',
  args: [{ name: 'input', type: 'string', required: true }],
  maxDurationSeconds: 60,
}
```

## Support

- Docs: https://docs.orien.xyz
- Discord: https://discord.gg/orien
- GitHub: https://github.com/ValenteCreativo/ORIEN
