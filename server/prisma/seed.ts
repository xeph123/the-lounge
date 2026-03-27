import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Helper function to get random item from array
const randomItem = <T>(array: T[]): T => array[Math.floor(Math.random() * array.length)]

// Helper function for random number in range
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

// Helper function for random date within last month
const randomDate = () => {
  const date = new Date()
  date.setDate(date.getDate() - randomInt(0, 30))
  return date
}

// Unsplash image URLs for different categories
const thumbnails = {
  architecture: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1449156001437-3a1f9d978349?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518005020251-0eb034920703?q=80&w=1000&auto=format&fit=crop',
  ],
  tech: [
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
  ],
  office: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1000&auto=format&fit=crop',
  ],
  abstract: [
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519750783826-51d007a994a3?q=80&w=1000&auto=format&fit=crop',
  ],
}

const allThumbnails = [...thumbnails.architecture, ...thumbnails.tech, ...thumbnails.office, ...thumbnails.abstract]

async function main() {
  console.log('Start seeding...')

  // 1. Clear existing data
  await prisma.comment.deleteMany()
  await prisma.like.deleteMany()
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
  await prisma.category.deleteMany()

  // 2. Create Categories
  const categoryData = [
    { name: 'Notice', slug: 'notice' },
    { name: 'Lounge', slug: 'lounge' },
    { name: 'Tech', slug: 'tech' },
    { name: 'Idea', slug: 'idea' },
  ]

  const categories: any[] = []
  for (const cat of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    categories.push(category)
  }

  // 3. Create Users
  const hashedPassword = await bcrypt.hash('test123', 10)
  const userData = [
    { email: 'admin@thelounge.co.kr', name: 'The Lounge Admin', department: 'Management', role: 'ADMIN' },
    { email: 'sarah.j@thelounge.co.kr', name: 'Sarah Jenkins', department: 'Design Strategy', role: 'USER' },
    { email: 'michael.c@thelounge.co.kr', name: 'Michael Chen', department: 'R&D Lab', role: 'USER' },
    { email: 'elena.v@thelounge.co.kr', name: 'Elena Volkov', department: 'Brand Experience', role: 'USER' },
    { email: 'david.k@thelounge.co.kr', name: 'David Kim', department: 'Platform Engineering', role: 'USER' },
  ]

  const users: any[] = []
  for (const user of userData) {
    const createdUser = await prisma.user.upsert({
      where: { email: user.email },
      update: { password: hashedPassword },
      create: {
        ...user,
        password: hashedPassword,
      },
    })
    users.push(createdUser)
  }

  // 4. Create Posts
  const postTemplates = {
    notice: [
      { title: 'The New Paradigm: 2024 하반기 새로운 비전 선포', content: '<h2>새로운 시대를 향한 발걸음</h2><p>우리는 기술과 예술의 경계를 허무는 선구자로서, 2024년 하반기 새로운 도약을 준비합니다.</p><blockquote>"혁신은 멈추지 않는 호기심에서 시작된다."</blockquote><p>우리의 핵심 가치는 <strong>지속가능성</strong>과 <strong>인간 중심 디자인</strong>에 있습니다. 모든 팀원들의 열정을 기대합니다.</p>' },
      { title: 'Office Relocation: 아카이브 타워로의 여정', content: '<h2>더 넓은 창의의 공간으로</h2><p>다가오는 11월, 본사가 강남 아카이브 타워로 이전합니다.</p><p>새로운 오피스는 <strong>개방성</strong>과 <strong>협업</strong>을 극대화하도록 설계되었습니다. 루프탑 라운지와 포커스 룸을 활용해 보세요.</p>' },
      { title: 'Q3 Town Hall Meeting: 분기 실적 및 미래 전략', content: '<p>지난 분기 우리는 놀라운 성장을 기록했습니다. 각 부서의 헌신에 감사드립니다.</p><h2>전략적 우선순위</h2><ul><li>글로벌 시장 진출 가속화</li><li>AI 기반 워크플로우 도입</li><li>사내 복지 프로그램 강화</li></ul>' },
    ],
    lounge: [
      { title: 'The Architecture of Silence: 고요함이 주는 영감', content: '<h2>정적의 미학</h2><p>복잡한 도심 속에서 우리는 어떻게 영감을 얻을까요? 미니멀리즘 건축은 그 답을 제시합니다.</p><p>단순한 선과 면이 만나는 지점에서 우리는 비로소 <strong>본질</strong>에 집중할 수 있습니다.</p><blockquote>"Less is More" - Mies van der Rohe</blockquote>' },
      { title: 'Weekend Playlist: 몰입을 돕는 로파이 비트', content: '<p>업무 효율을 높여줄 선별된 플레이리스트를 공유합니다. 감각적인 비트와 함께 한 주의 마무리를 차분하게 즐겨보세요.</p><h2>Curated by Elena</h2><p>이번 주는 <strong>Jazz-hop</strong> 위주로 구성되었습니다.</p>' },
      { title: 'Barista Series: 오피스 카페 최고의 원두는?', content: '<h2>Coffee Culture</h2><p>우리 라운지에서 제공되는 원두 3종을 비교 분석해 보았습니다. 산미와 바디감의 조화를 경험해 보세요.</p><p><strong>에티오피아 예가체프</strong>: 꽃향기와 기분 좋은 산미.</p>' },
    ],
    tech: [
      { title: 'React 19 & Vibe Coding: 개발 문화의 진화', content: '<h2>React 19의 혁신적 기능들</h2><p>컴파일러 수준의 최적화가 가져올 변화는 가히 혁명적입니다. 더 이상 불필요한 useMemo와 useCallback에 매몰될 필요가 없습니다.</p><p><strong>Vibe Coding</strong>은 기술적 제약을 넘어 기분에 맞춘 직관적인 개발 경험을 제공합니다.</p>' },
      { title: 'Distributed Systems: 탄력적인 아키텍처 설계', content: '<h2>Scalability and Resilience</h2><p>마이크로서비스 환경에서 장애를 어떻게 격리하고 회복할 것인가? 서킷 브레이커 패턴과 이벤트 드리븐 설계를 심도 있게 다룹니다.</p><p>우리는 <strong>안정성</strong>을 최우선으로 합니다.</p>' },
      { title: 'The Rise of AI Agents: 인간과 AI의 협업 모델', content: '<h2>Next-gen Productivity</h2><p>단순한 챗봇을 넘어, 자율적으로 작업을 수행하는 AI 에이전트가 우리의 워크플로우를 어떻게 바꿀까요?</p><p><strong>Tech Lab</strong>에서는 관련 연구를 진행 중입니다.</p>' },
    ],
    idea: [
      { title: 'Minimalist Workspace: 생산성을 높이는 데스크 셋업', content: '<h2>Clean Desk, Clear Mind</h2><p>불필요한 케이블과 잡동사니를 치우는 것만으로도 집중력이 30% 향상됩니다.</p><p>최적의 조도와 <strong>모니터 암</strong> 활용법을 제안합니다.</p>' },
      { title: 'Next Project Pitch: 하이엔드 웰니스 플랫폼', content: '<h2>Digital Wellness</h2><p>바쁜 현대인을 위한 명상과 생산성 도구를 결합한 새로운 플랫폼 아이디어입니다.</p><p><strong>UX 디자인</strong>의 핵심은 사용자 감정의 흐름을 읽는 것입니다.</p>' },
      { title: 'Sustainability in Design: 지속 가능한 디자인의 가치', content: '<h2>Eco-friendly Innovation</h2><p>디지털 제품에서도 탄소 발자국을 줄일 수 있을까요? 효율적인 코드와 자산 관리가 그 해답입니다.</p>' },
    ],
  }

  for (const category of categories) {
    const templates = postTemplates[category.slug as keyof typeof postTemplates] || postTemplates.lounge
    
    // Create at least 10 posts for each category
    for (let i = 0; i < 11; i++) {
      const template = templates[i % templates.length]
      const isNoThumbnail = i % 4 === 0 // 2-3 out of 10-11 posts will have no thumbnail
      
      const post = await prisma.post.create({
        data: {
          title: `${template.title} #${i + 1}`,
          content: template.content,
          thumbnail: isNoThumbnail ? null : randomItem(allThumbnails),
          categoryId: category.id,
          authorId: randomItem(users).id,
          viewCount: randomInt(10, 500),
          createdAt: randomDate(),
        },
      })

      // 5. Create Comments for some posts
      if (i % 3 === 0) {
        const commentCount = randomInt(1, 3)
        for (let j = 0; j < commentCount; j++) {
          await prisma.comment.create({
            data: {
              postId: post.id,
              authorId: randomItem(users).id,
              content: randomItem([
                '와 정말 좋은 글이네요! 잘 읽었습니다.',
                'Great insights, thank you for sharing.',
                '공감이 많이 가는 내용입니다. 다음 글도 기대할게요.',
                'This is exactly what I was looking for. Brilliant!',
                'Interesting perspective on this topic.',
              ]),
              createdAt: new Date(post.createdAt.getTime() + randomInt(1000, 100000)),
            },
          })
        }
      }
    }
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
