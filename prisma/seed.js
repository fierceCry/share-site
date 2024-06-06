import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  const userData = [
    {
      nickname: 'example_user',
      email: 'example@example.com',
      password: 'password123',
      imageUrl: 'https://nyjtkd.net/common/img/default_profile.png',
      oneLiner: '괴식 맛집 추천 드립니다.',
      provider: 'local',
      emailVerified: true
    },
    {
      nickname: 'example_user1',
      email: 'example2@example.com',
      password: 'password123',
      imageUrl: 'https://nyjtkd.net/common/img/default_profile.png',
      oneLiner: '맛집 추천 많이 해드릴게요.',
      provider: 'local',
      emailVerified: true
    }
  ];

  for (const user of userData) {
    await prisma.user.create({ data: user });
  }

  console.log('유저 생성 완료:');

  const categories = [
    { regionName: '수도권' },
    { regionName: '충청권' },
    { regionName: '호남권' },
    { regionName: '영남권' },
    { regionName: '강원권' },
    { regionName: '제주권' },
  ];

  for (const category of categories) {
    await prisma.regionCategory.create({ data: category });
  }

  console.log('category seed 완료!!');

  const posts = [
    {
      title: "스시사이토 쥬욘",
      content: "‘죽기 전에 꼭 가봐야 할 스시야’로 이름난 일본 도쿄의 유명 스시야 ‘스시 사이토’가 자신의 이름과 로고를 허락했을 정도로 아끼는 애제자 김주영 셰프가 청담에 둥지를 마련했습니다. 사이토에서 6년간 수련하며 쌓은 노하우를 바탕으로 기본에 충실한 일본 정통 스시를 선보입니다. 사이토의 이름답게 실내 구조부터 노렌까지 도쿄의 업장을 그대로 구현했습니다. 상큼한 모즈쿠(큰실말절임)부터 연어알, 문어, 게, 아귀간 등의 츠마미에 이어 여러 종류의 스시가 순서대로 마련됩니다. 가오픈기간 BTS 슈가와 지민이 다녀가며 더 화제가 되는 등 이슈가 되고 있는 곳인만큼 예약이 쉽지 않은 것이 유일하게 아쉬운 점입니다.",
      regionId: 1,
      imageUrl: ["https://img.siksinhot.com/place/1697513630705448.jpg?w=307&h=300&c=Y"],
      userId: 1
    },
    {
      title: "새벽집 청담동점",
      content: "소고기 전문점 ‘새벽집’은 유명 연예인들의 단골집으로도 유명합니다. 매장 내부는 테이블마다 분리되어 있어 편안한 분위기에서 식사할 수 있습니다. 대표 메뉴 ‘육회비빔밥’을 주문하면 얼큰한 선지 해장국이 서비스로 제공됩니다. 비빔밥은 애호박, 당근, 콩나물, 김가루 등 기본 나물 위에 붉은 육회가 푸짐하게 얹어 나옵니다. 고추장 양념을 넣고 비벼낸 비빔밥을 마른 김에 싸서 먹는 것도 별미입니다.",
      regionId: 1,
      imageUrl: ["https://img.siksinhot.com/place/1530597402238010.jpg?w=540&h=436&c=X"],
      userId: 1
    },
    {
      title: "톡톡",
      content: "다양한 분야에서 경력을 쌓은 김대천 셰프의 레스토랑입니다. 프렌치(French)를 기반으로 이탈리안(Italian), 재패니스(Japanese), 차이니스(Chinese) 등을 접목하며, 색다른 맛을 선보입니다. 식재료에 대한 셰프의 남다른 열정과 고집으로 최상급의 재료를 사용하며, 희귀한 식재료들을 활용한 요리를 선보이기도 합니다.",
      regionId: 1,
      imageUrl: ["https://img.siksinhot.com/place/1453173971950464.jpg?w=307&h=300&c=Y"],
      userId: 1
    },
    {
      title: "해운대암소갈비집",
      content: "1964년에 문을 열어 2대째 이어져 온 역사 깊은 한우 전문점입니다. 독특한 양념으로 순수 한우의 특성을 최대한 살려 부드럽고 구수한 맛으로  해운대 갈비의 명성을 떨친 원조  해운대 갈빗집입니다. 한옥을 개조한 곳으로, 독립된 공간이 확보되어 있어 차분한 분위기에서 식사가 가능하며 단체 모임으로 방문하기에도 좋은 곳입니다.",
      regionId: 4,
      imageUrl: ["https://img.siksinhot.com/place/1456999780039475.jpg?w=540&h=436&c=Y"],
      userId: 1
    },
    {
      title: "속시원한대구탕",
      content: "달맞이길에 위치한 대구탕 전문점 ‘속 시원한 대구탕’입니다. 내부가 넓어 단체모임이나 가족 단위의 손님들도 많이 방문합니다. 대표 메뉴 ‘대구탕’은 통통하게 살이 오른 대구를 가득 담아주어 탱글탱글한 대구살을 양껏 즐길 수 있습니다. 말린 대구를 이용하여 꼬돌꼬돌한 식감이 특징. 조금 더 칼칼한 맛을 원하면 테이블에 있는 양념장을 넣으면 됩니다. 대구 곤이를 추가하여 조금 더 풍성하게 즐길 수도 있습니다.",
      regionId: 4,
      imageUrl: ["https://img.siksinhot.com/place/1491276559013543.jpg?w=307&h=300&c=Y"],
      userId: 1
    },
    {
      title: "왕거미식당",
      content: "동인동 좁은 골목 안에서 30년 이상 영업해온 생고기 전문점으로 생고기, 오드레기 등이 인기 메뉴 입니다. 신선한 생고기가 푸짐하게 나옵니다. 오드레기 뭉티기 등의 대구식 생고기를 특유의 양념장에 찍어 먹으면 맛이 일품입니다.",
      regionId: 4,
      imageUrl: ["https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbaUACt%2FbtshKRGDJwf%2FLlIPX96M7dIqf6PeFzIsn0%2Fimg.jpg"],
      userId: 1
    },
    {
      title: "국일따로국밥",
      content: "60년이 넘게 3대째 영업중인 국밥맛집입니다. 따로국밥은 사골 육수에 선지와 소고기, 고춧가루와 대파, 무 등의 야채를 넣고 푹 끓인 후에 생마늘과 부추를 얹어 먹는 음식입니다. 대구에서 꼭 먹어봐야할 음식으로 꼽힙니다.",
      regionId: 4,
      imageUrl: ["https://img.siksinhot.com/place/1458743467138056.jpg?w=540&h=436&c=Y"],
      userId: 1
    },
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
  }

  console.log('Post 생성 완료:');
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
