import { prisma } from '../lib/db/prisma'

async function main() {
  console.log('Seeding database...')

  // Create Relic project
  const relicProject = await prisma.project.create({
    data: {
      name: 'Relic',
      description: 'iOS mobile application that uses AI-powered image recognition to instantly identify, appraise, and provide historical information about antiques and vintage items.',
      targetAudience: 'Ages 55+, antique enthusiasts, collectors, estate sale shoppers',
      tone: 'Trustworthy, expert, reassuring, helpful',
      examples: JSON.stringify([
        'Hook: "I inherited my grandmother\'s entire collection and had no idea what anything was worth" Body: "Then I discovered Relic. Just snap a photo and instantly get the history, value, and details of any antique. It\'s like having an expert appraiser in your pocket - and it\'s completely free. Download Relic today."',
        'Hook: "Antique dealers don\'t want you to know about this app" Body: "Relic uses AI to instantly identify and appraise any vintage item. No more guessing, no more expensive appraisers. Just point your camera and get accurate values based on real sales data. The app that puts expert knowledge in your hands."',
      ]),
    },
  })

  // Create TYB project
  const tybProject = await prisma.project.create({
    data: {
      name: 'TYB',
      description: 'Social shopping app where users get free products from brands like Glossier, Saie, and SET in exchange for completing challenges and leaving reviews.',
      targetAudience: 'Young women ages 18-30 who want to feel like influencers and get PR packages',
      tone: 'Casual, insider, FOMO-driven, conversational',
      examples: JSON.stringify([
        'Hook: "I figured out this hack to get brands to send me exclusive products and treat me like an influencer even though I only have 900 followers" Body: "So I found this new app TYB which is very lowkey right now, but big brands have recently started using it to send free products in exchange for content. All you have to do is find the brand you want and scroll through and complete these challenges. Then in exchange for your feedback, photos, whatever, they send you products! If you want to try it out you should probably download it right now because I\'m not gatekeeping it anymore and it\'s starting to blow up"',
        'Hook: "I\'m not an influencer and I got ALL of these brand packages for free. Here\'s the tea" Body: "So I found this new app TYB which is very lowkey right now, but big brands have recently started using it to send free products in exchange for content. All you have to do is find the brand you want and scroll through and complete these challenges. Then in exchange for your feedback, photos, whatever, they send you products! If you want to try it out you should probably download it right now because I\'m not gatekeeping it anymore and it\'s starting to blow up"',
        'Hook: "Brands like Saie, SET, and Glossier are sending exclusive 2026 product previews and I can show you exactly how I got access" Body: "So I found this new app TYB which is very lowkey right now, but big brands have recently started using it to send free products in exchange for content. All you have to do is find the brand you want and scroll through and complete these challenges. Then in exchange for your feedback, photos, whatever, they send you products! If you want to try it out you should probably download it right now because I\'m not gatekeeping it anymore and it\'s starting to blow up"',
      ]),
    },
  })

  // Create global format templates
  await prisma.scriptFormat.create({
    data: {
      name: 'UGC Hook + Body',
      structure: 'Personal hook (3 seconds) → Problem identification → Solution presentation → Clear CTA',
      visualDescription: 'Person speaking directly to camera in casual setting (home office, coffee shop). Authentic, conversational tone. Cut between different locations for variety.',
      isGlobal: true,
      examples: JSON.stringify([
        'Hook: "I was spending hours trying to organize my photos until I found this app" Body: "It uses AI to automatically sort everything by date, location, and even who is in the photo. No more scrolling through thousands of pictures to find what you need. Download it free and get your photo library organized in minutes."',
        'Hook: "If you are still manually tracking your expenses, you need to see this" Body: "This app connects to your bank and automatically categorizes every transaction. You can set budgets, get alerts, and actually see where your money goes each month. It is completely free and takes 2 minutes to set up."',
      ]),
    },
  })

  await prisma.scriptFormat.create({
    data: {
      name: 'Problem-Agitate-Solve',
      structure: 'Hook with problem (3s) → Agitate the pain → Present solution → Social proof → CTA',
      visualDescription: 'Start with frustrated person experiencing the problem, transition to relief/success using the product. Screen recordings mixed with talking head.',
      isGlobal: true,
      examples: JSON.stringify([
        'Hook: "Tired of forgetting passwords and getting locked out of accounts?" Body: "It happens to everyone, and resetting passwords wastes so much time. This password manager remembers everything for you and auto-fills with one click. Over 10 million people trust it to keep their accounts secure. Try it free today."',
        'Hook: "Hate how long it takes to edit videos on your phone?" Body: "Most apps are clunky and confusing, making simple edits take forever. This editor uses AI to cut, trim, and add effects automatically. Just pick your style and it handles the rest. Download free and edit like a pro."',
      ]),
    },
  })

  await prisma.scriptFormat.create({
    data: {
      name: 'Testimonial Style',
      structure: 'Personal story hook → "I used to struggle with..." → "Then I found [product]" → Results → Recommendation',
      visualDescription: 'Single person in well-lit setting, casual but polished. B-roll of product in use. Genuine, story-driven approach.',
      isGlobal: true,
      examples: JSON.stringify([
        'Hook: "I used to wake up exhausted every single morning, no matter how much I slept" Body: "I tried everything - new mattress, supplements, you name it. Then I found this sleep tracking app that actually figured out my problem. It analyzed my sleep patterns and gave me personalized tips. Within two weeks I was waking up refreshed. If you are struggling with sleep, try this app."',
        'Hook: "My garden was dying and I had no idea why until I downloaded this app" Body: "I thought I had a black thumb, but it turns out I was just watering wrong. This app identifies plants and tells you exactly how to care for them. My garden is thriving now and people ask me for advice. Download it and save your plants."',
      ]),
    },
  })

  // Create TYB-specific format
  await prisma.scriptFormat.create({
    data: {
      name: 'Insider Secret / FOMO',
      structure: 'Hook revealing exclusive hack → Casual explanation of app → Name-drop premium brands → Urgency CTA before it "blows up"',
      visualDescription: 'Casual selfie-style video. Show PR packages or products received. Conversational, like telling a friend a secret. Use trending audio/music.',
      isGlobal: false,
      projectId: tybProject.id,
      examples: JSON.stringify([
        'Hook: "I figured out this hack to get brands to send me exclusive products and treat me like an influencer even though I only have 900 followers" Body: "So I found this new app TYB which is very lowkey right now, but big brands have recently started using it to send free products in exchange for content. All you have to do is find the brand you want and scroll through and complete these challenges. Then in exchange for your feedback, photos, whatever, they send you products! If you want to try it out you should probably download it right now because I am not gatekeeping it anymore and it is starting to blow up"',
      ]),
    },
  })

  // Create Relic-specific format
  await prisma.scriptFormat.create({
    data: {
      name: 'Problem-Solution Demo',
      structure: 'Personal story hook about antique mystery → Show app in action (scan demo) → Reveal results → Value prop → CTA',
      visualDescription: 'Mix of talking head and phone screen recording showing the app scanning an item and displaying results. Demonstrate the "wow" moment of instant identification.',
      isGlobal: false,
      projectId: relicProject.id,
      examples: JSON.stringify([
        'Hook: "I inherited my entire collection and had no idea what anything was worth" Body: "Then I discovered Relic. Just snap a photo and instantly get the history, value, and details of any antique. It is like having an expert appraiser in your pocket - and it is completely free. Download Relic today."',
      ]),
    },
  })

  console.log('Database seeded successfully!')
  console.log(`Created projects: ${relicProject.name}, ${tybProject.name}`)
  console.log('Created 5 script formats (3 global, 2 project-specific)')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
