type Contribution = {
  date: string
  count: number
}

type ContributionsResponse = {
  contributions: Contribution[]
}

const API_URL = 'https://github-contributions-api.jogruber.de/v4/repath500?y=last'

export function rhythmFromContributions(contributions: Contribution[]): string {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)

  const recent = contributions
    .filter((entry) => new Date(entry.date) >= cutoff)
    .reduce((sum, entry) => sum + entry.count, 0)

  if (recent === 0) return 'quiet week. thinking week.'
  if (recent <= 10) return 'steady rhythm. code leaving the machine.'
  if (recent <= 25) return 'heavy week. shipping week.'
  return 'full sprint. the commits are stacking.'
}

export async function fetchContributionRhythm(): Promise<string | null> {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) return null
    const data = (await response.json()) as ContributionsResponse
    return rhythmFromContributions(data.contributions ?? [])
  } catch {
    return null
  }
}
