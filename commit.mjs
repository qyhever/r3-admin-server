import { execSync } from 'child_process'

try {
  const [, , commitTitle] = process.argv
  const commands = [
    'git pull',
    'git add .',
    `git commit -m "${commitTitle || 'commit ' + new Date().toLocaleString()}"`,
    'git push'
  ]
  execSync(commands.join(' && '), {
    stdio: 'inherit'
  })
} catch (error) {
  console.log('error: ', error)
}