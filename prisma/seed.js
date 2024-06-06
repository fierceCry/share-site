import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
  const userData = [
    {
      nickname: 'kimmangyu',
      email: 'example1@example.com',
      password: 'password123',
      imageUrl: 'https://nyjtkd.net/common/img/default_profile.png',
      oneLiner: '괴식 맛집 추천 드립니다.',
      provider: 'local',
      emailVerified: true,
    },
    {
      nickname: '길현',
      email: 'example2@example.com',
      password: 'password123',
      imageUrl: 'https://nyjtkd.net/common/img/default_profile.png',
      oneLiner: '맛집 추천 많이 해드릴게요.',
      provider: 'local',
      emailVerified: true,
    },
    {
      nickname: '이민준',
      email: 'example3@example.com',
      password: 'password123',
      imageUrl: 'https://nyjtkd.net/common/img/default_profile.png',
      oneLiner: '안녕하세요 공유 많이 하겠습니다',
      provider: 'local',
      emailVerified: true,
    },
    {
      nickname: '박서진',
      email: 'example4@example.com',
      password: 'password123',
      imageUrl: 'https://nyjtkd.net/common/img/default_profile.png',
      oneLiner: '맛집 추천 받습니다.',
      provider: 'local',
      emailVerified: true,
    },
    {
      nickname: '운',
      email: 'example5@example.com',
      password: 'password123',
      imageUrl: 'https://nyjtkd.net/common/img/default_profile.png',
      oneLiner: '맛집 추천 많이 해드릴게요.',
      provider: 'local',
      emailVerified: true,
    },
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
      title: '스시사이토 쥬욘',
      content:
        '‘죽기 전에 꼭 가봐야 할 스시야’로 이름난 일본 도쿄의 유명 스시야 ‘스시 사이토’가 자신의 이름과 로고를 허락했을 정도로 아끼는 애제자 김주영 셰프가 청담에 둥지를 마련했습니다. 사이토에서 6년간 수련하며 쌓은 노하우를 바탕으로 기본에 충실한 일본 정통 스시를 선보입니다. 사이토의 이름답게 실내 구조부터 노렌까지 도쿄의 업장을 그대로 구현했습니다. 상큼한 모즈쿠(큰실말절임)부터 연어알, 문어, 게, 아귀간 등의 츠마미에 이어 여러 종류의 스시가 순서대로 마련됩니다. 가오픈기간 BTS 슈가와 지민이 다녀가며 더 화제가 되는 등 이슈가 되고 있는 곳인만큼 예약이 쉽지 않은 것이 유일하게 아쉬운 점입니다.',
      regionId: 1,
      imageUrl: [
        'https://img.siksinhot.com/place/1697513630705448.jpg?w=307&h=300&c=Y',
      ],
      userId: 1,
    },
    {
      title: '새벽집 청담동점',
      content:
        '소고기 전문점 ‘새벽집’은 유명 연예인들의 단골집으로도 유명합니다. 매장 내부는 테이블마다 분리되어 있어 편안한 분위기에서 식사할 수 있습니다. 대표 메뉴 ‘육회비빔밥’을 주문하면 얼큰한 선지 해장국이 서비스로 제공됩니다. 비빔밥은 애호박, 당근, 콩나물, 김가루 등 기본 나물 위에 붉은 육회가 푸짐하게 얹어 나옵니다. 고추장 양념을 넣고 비벼낸 비빔밥을 마른 김에 싸서 먹는 것도 별미입니다.',
      regionId: 1,
      imageUrl: [
        'https://img.siksinhot.com/place/1530597402238010.jpg?w=540&h=436&c=X',
      ],
      userId: 2,
    },
    {
      title: '톡톡',
      content:
        '다양한 분야에서 경력을 쌓은 김대천 셰프의 레스토랑입니다. 프렌치(French)를 기반으로 이탈리안(Italian), 재패니스(Japanese), 차이니스(Chinese) 등을 접목하며, 색다른 맛을 선보입니다. 식재료에 대한 셰프의 남다른 열정과 고집으로 최상급의 재료를 사용하며, 희귀한 식재료들을 활용한 요리를 선보이기도 합니다.',
      regionId: 1,
      imageUrl: [
        'https://img.siksinhot.com/place/1453173971950464.jpg?w=307&h=300&c=Y',
      ],
      userId: 1,
    },
    {
      title: '해운대암소갈비집',
      content:
        '1964년에 문을 열어 2대째 이어져 온 역사 깊은 한우 전문점입니다. 독특한 양념으로 순수 한우의 특성을 최대한 살려 부드럽고 구수한 맛으로  해운대 갈비의 명성을 떨친 원조  해운대 갈빗집입니다. 한옥을 개조한 곳으로, 독립된 공간이 확보되어 있어 차분한 분위기에서 식사가 가능하며 단체 모임으로 방문하기에도 좋은 곳입니다.',
      regionId: 4,
      imageUrl: [
        'https://img.siksinhot.com/place/1456999780039475.jpg?w=540&h=436&c=Y',
      ],
      userId: 4,
    },
    {
      title: '속시원한대구탕',
      content:
        '달맞이길에 위치한 대구탕 전문점 ‘속 시원한 대구탕’입니다. 내부가 넓어 단체모임이나 가족 단위의 손님들도 많이 방문합니다. 대표 메뉴 ‘대구탕’은 통통하게 살이 오른 대구를 가득 담아주어 탱글탱글한 대구살을 양껏 즐길 수 있습니다. 말린 대구를 이용하여 꼬돌꼬돌한 식감이 특징. 조금 더 칼칼한 맛을 원하면 테이블에 있는 양념장을 넣으면 됩니다. 대구 곤이를 추가하여 조금 더 풍성하게 즐길 수도 있습니다.',
      regionId: 4,
      imageUrl: [
        'https://img.siksinhot.com/place/1491276559013543.jpg?w=307&h=300&c=Y',
      ],
      userId: 3,
    },
    {
      title: '백향담',
      content:
        '단양 대표 떡갈비&석갈비 전문점. 15년 동안 음식에 최선을 다한 요리사가 만든 대표 음식들. 여러가지 소고기 부위와 돼지 부위를 적절히 섞어 최상의 맛을 이끌어냈습니다. 단양 마늘과 흑 마늘을 이용한 단양만의 특색 있는 전문점 입니다.',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220421_209%2F1650533262818hQnPA_JPEG%2FKakaoTalk_20220421_154817821.jpg',
      ],
      regionId: 2,
      userId: 2,
    },
    {
      title: '한버들떡갈비',
      content:
        '제천에 있는 명물 한방 약재로 만든 수제 떡갈비!! 청풍호의 청정 자연이 깃드는 시간, 넓은 주차공간과 전기차 충전소도 마련되어 있습니다. 먹는 이의 행복을 기원하며 음식을 빚은 정성이 모여 슬로우푸드를 만듭니다.\n자연에서 얻은 원재료에 대해 다시 한 번 생각하며\n시간과 노력으로 만들어진 음식의 소중함을 알고 함께 하는 사람들과 즐겁게 식사하세요.\n그 순간 한버들에서 드시는 음식이 세상에서 가장 맛있는 슬로우푸드가 됩니다.',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA0MDFfMjkw%2FMDAxNzExOTYwMTMzOTgx.gIle13LedSmDOGJP3fGOd4JQlZqTzQZvHuqAt4_LYFgg.FJKKbwSu4mZjvWYgCsFoZxP8VapaRKXkgf4tG1BDjwEg.JPEG%2FE38C9F16-5F5A-4030-9E6D-63447084D38C.jpeg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 2,
      userId: 4,
    },
    {
      title: '단양민물매운탕쏘가리',
      content:
        '단양군의 명물 먹거리인 쏘가리매운탕, 쏘가리회, 마늘떡갈비를 중심으로 맛볼 수 있는 단양 맛집, 단양민물매운탕쏘가리 입니다. 지하 후면 30대 주차장 완비 단체분들이 와도 넉넉히 앉을 수 있는 공간입니다.',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221214_102%2F1670994637738oCf6i_PNG%2FKakaoTalk_20221214_140624101.png',
      ],
      regionId: 2,
      userId: 2,
    },
    {
      title: '진주집',
      content:
        '주말 점심시간에 방문 하니 대기줄이 길어요 그래도 회전율이 빨라서 20분만에 줄이 빨리 빠지는 편입니다 육개장칼국수는 4월말까지만 먹을수있다고 하여 닭칼국수 맛있게 먹었습니다 닭칼국수에 들어있는 만두도 맛있고 김치도 달달하니 맛있어요',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20150817_167%2F14398056264455qtod_JPEG%2F166767593044276_1.jpg',
      ],
      regionId: 1,
      userId: 3,
    },
    {
      title: '광화문미진',
      content:
        '1952년부터 광화문 일대를 지켜온 터줏대감인 미진은 한국식 냉메밀국수 전문점으로, 일본식 소바 쯔유보다 진한 맛의 간장 육수와 더 쫄깃한 식감의 메밀 면발을 선보인다. 식당 지하에 운영하는 공장에서 육수와 면을 직접 생산해 손님들에게 바로바로 제공한다. 한 주전자 가득 담긴 차가운 육수와 테이블마다 인심 좋게 제공하는 메밀국수 고명은 기호에 따라 가감이 가능하다. 숙주와 두부, 신김치와 돼지고기 소로 채운 메밀전병 역시 이 집의 인기 메뉴인데, 1인분의 반인 한 줄씩도 판매합니다.',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA2MDRfMjc2%2FMDAxNzE3NTExMDk1MTY1.85TmGQVtbvytvJJd_bhypzCvYr6Y7vT5ITYIDpJ0hbUg.ryPJ63WsCTaR4GHyNFpILz-iF5aen4in0HEfd5-RqVQg.JPEG%2F69E1A37E-BF3E-46BA-BD57-D0D081F6CBAE.jpeg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 1,
      userId: 4,
    },
    {
      title: '유명산흥부네솥뚜껑닭볶음탕',
      content:
        '예전에 산골농원에 사람이 많아서 그 옆에 있는 이곳에 와서 먹었었는데 그때보다 맛도 좋아지고 시설도 좋아졌네요! 테이블당 최소 3인으로 시켜야하지만 둘이 충분히 배불리 먹을 수 있어요~ 자알 먹고 가요!',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MzFfMTIy%2FMDAxNzE3MTE1NTMxMjk0.WH6rGQGkbcfImSMFp8sbBL2Fxy-0pSrs9nwAdwffSqQg.qveAng5SBCzFU0ZLWDu-O6mmY2LJQ43y2q8C0sPRMl8g.JPEG%2FBF81BAB1-22F9-43AF-A7B2-B4896E8C29E6.jpeg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 1,
      userId: 5,
    },
    {
      title: '예향식당',
      content:
        '광주 호남동에 위치한 한식당입니다. 게장, 닭장조림, 나물, 생선구이, 국, 전, 무침 등 20여가지의 반찬을 함께 맛볼 수 있는 백반이 대표적인 메뉴인데요. 인근 직장인들이 많이 찾는 곳이지요.',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MDJfMjYg%2FMDAxNzE0NjI3OTg2MjQ4.CGeXp58FnOSULzDAdRCJX3nLGyd60PwRqzqXl-EEF98g.kVpX_ax1lmFuP81qt4FEes1wkO-xfU85OMw2KHulZSQg.JPEG%2FIMG_9843.jpeg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 3,
      userId: 1,
    },
    {
      title: '초가집',
      content:
        '이 집 갈치조림 맛집이네요! 다른 음식도 모두 다 맛있지만 갈치조림에 무랑 감자도 넉넉히 넣어주시고 간도 적당히 배어서 정말 맛있게 먹었습니다. 다른 반찬도 모두 깔끔하고 맛있어요.',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MDFfMjIg%2FMDAxNzE0NTMyMzIwNjIz.gBxX7f0QnTTeK26A8LuB6Q68uwQEVG243XG4RhmTOWcg.ovJ7JlG_taq35m3Y_cRPntV2G62Pu0wXKOEKxhj0X1Mg.JPEG%2F2B4DED74-D461-4EF7-8760-DA74FADA3E27.jpeg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 3,
      userId: 3,
    },
    {
      title: '해남식당',
      content:
        '바지락해장국과 계란말이 먹었어요 바지락해장국 완전맛있어요 국물이 시원합니다 계란말이도 맛있어요',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA0MjVfMTk4%2FMDAxNzE0MDUwOTE3Njcz.MvJo-y4JTnoCvEVR45gn5oMq0Clc9bpS0bfC4VORy_4g.e3-HoTN5UcQc3fxBEaPGkSE5_trCYCTM3V7xV77Dw4wg.JPEG%2F20240425_112022.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 3,
      userId: 4,
    },
    {
      title: '향화정',
      content:
        '꼬막비빔밥이 주력인것 같아서 꼬막비빔밥이랑 경주왔으니 육회물회도 시켰어요 꼬막비빔밥 진짜 맛있었어요!! 꼬막 양도 엄청 많고! 육회물회는 얼음이 녹을수록 더 맛있어지더라구요. 월요일 점심이라 5~10분내로 바로 입장했고 여기오길 잘했다 생각했습니다. 맛있게 잘 먹고 왔어요',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240111_33%2F1704932199310QYkMH_JPEG%2FKakaoTalk_Photo_2024-01-11-09-15-51_002jpeg.jpeg',
      ],
      regionId: 4,
      userId: 5,
    },
    {
      title: '대풍관',
      content:
        '계절에 따라 다른메뉴가 너무 좋았어요 겨울엔 굴세트 봄.여름엔 생생물회세트가 너무 좋아요 날씨가 화창하고 더운날이라 더 좋았던것같아요 아침겸 이른점심으로 일찍 방문했더니 손님이 많지 않아 좋았어요 음식이 너무 맛있는데 배가 너무 불러 다 먹을 수 없어서 남기고 오는게 아쉬웠어요',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA0MDhfMTYx%2FMDAxNzEyNTg0NzY4ODg4.nyOYDn6BmKozMv9oJvZ0WYY6vbaXUC8oJLaD16L3iN8g.2-XeMq1M7akQLQNuesdjVwda8xymgPCqM6SrCeOT9LAg.JPEG%2F0D000FBC-3E37-4FC3-A5BC-0C240CD903F0.jpeg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 4,
      userId: 3,
    },
    {
      title: '수변최고돼지국밥',
      content:
        '부산 광안리 돼지국밥맛집 수변최고돼지국밥 본점에 다녀왔습니다 가격에 어울리는 살코기의양과 맛보기순대도 실해서 혼자가서 배부르게 먹고왔습니다 셀프바도 있어 모자란건 바로 가져와 먹을수있으니 역시 최고입니다!!! 음식이 맛있어요재료가 신선해요양이 많아요특별한 메뉴가 있어요',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MzFfMjE4%2FMDAxNzE3MTU3MzkyNTA5.sQtJxrZo3L40e7mfYX0RGSzFzYfS86mMb02O0f-qEpUg.Oyzp9nsP1rzwKdSf3Dl1smukbAQlVeG23PngiMEkldkg.JPEG%2F20240531_120824.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 4,
      userId: 4,
    },
    {
      title: '강릉꼬막비빔밥 풍호맛뜨락',
      content:
        '강릉 맛집 찾다 왔어요~ 다른곳도 있었지만 수육이 매략적이라 왔는데 후회없네요 꼬막 비빔밥은 당연히 맛있구 수육도 부드럽고 물회도 적당한 새콤함에 넘 시원하네요 먼길 왔는데 힐링하고 갑니다',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20231109_8%2F1699507256918yhXx7_JPEG%2Ftemp_file.jpg',
      ],
      regionId: 5,
      userId: 2,
    },
    {
      title: '고씨네동해막국수',
      content:
        '자가제면으로 주문즉시 면을 뽑고. 명태식해, 양양들기름, 초당순두부, 까막장 등 강원도의 좋은 재료를 새롭게 재해석한 메뉴를 선보이는 강릉 메밀음식 전문점입니다.',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MThfMTUy%2FMDAxNzE2MDAxNjEyNzk5.h6DedVfbZvC5PfTAcM1bo9AdkrDUsujKWHChORL0upcg.oqtHFo-CLGz8Twgr_dMAZZWIX4hK_9V9vxPEy9gl60Qg.JPEG%2F20240518_113823.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 5,
      userId: 2,
    },
    {
      title: '김정옥할머니순두부',
      content:
        '속초 친구 소개로 처음 방문해봤어요 순두부를 주문했는데 맛있어서 한그릇 뚝딱했습니다 굉장히 단백하고 고소한맛이 일품이더라구요 외식하면 속이 더부룩하기도 했는데 두부라 그런지 속이 편안하고 좋네요',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MjFfMTI2%2FMDAxNzE2MzAzMTIwNTE0.XXp5f-75ecfMs3Aa_F9e2c0_eNjcpb6MTk91JVtSp8Ug.0QZ4R8Rb2TiMw6L8g8uapmor87v4aBZjT4A_7A-GEBEg.JPEG%2F20240521_124439.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 5,
      userId: 3,
    },
    {
      title: '올래국수',
      content:
        '제주도 가면 고기국수 한 그릇씩은 먹게 되는데 여태까지 먹은 고기국수집 중에 제일 맛있었어요! 돼지 잡내 없이 국물 깊고 진하고 넘나 맛있어요! 김치도 맛있어요 제주공항이랑도 가까워서 고기국수 한그릇 후딱 먹고가기 좋아요',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA2MDZfMTkx%2FMDAxNzE3NjczNzA0MDYx.EFZwfo1y3iC0KEcyWUTlKAbHLTI_31qQQR0kIFnTYuog.kSfPpG7d80wn7WpPvhVSqjs_kWHf6h1LHxruZ9pPLh4g.JPEG%2F2184F123-73B0-4519-82A7-037870ED3402.jpeg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 6,
      userId: 1,
    },
    {
      title: '제주로움',
      content:
        '제주로움 돈카츠 메뉴가 간단해서 좋네요 돈카츠 고기부드럽고 오징어먹물로 컽을 둘러싸고있어서 특이하고 맛있었어요 장소는 자그마한곳이라 아담하네요',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MDRfNTYg%2FMDAxNzE0NzUwNzYxMjM2.7t0nJBmSYmiNVby2J5WxfGE-5GG4XoIjh-adBCydYKAg.wvcYqFdi7ih5x56jZEzXvRAbiJ6R1J_31uXrY7mXE-Mg.JPEG%2F5182F76D-B8F2-48BB-BCC2-780E1A189BB0.jpeg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 6,
      userId: 2,
    },
    {
      title: '제주의노을',
      content:
        '고등어회는 비리지않고 딱새우도 싱싱한곳입니다 직원분들께서도 친절하시고 저흰 저녁에 방문했지만 낮에오셔도 뷰가 끝내줄거같습니다!',
      imageUrl: [
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA2MDNfMjM4%2FMDAxNzE3Mzk4MjE1NTY0.abY6gFHQAadrkWeRmQsB-BJVGtJz9o0ONeY_Zpeb7Hgg.psF_TMrBFybDh4BxG8_sWIdaDCNQ22I0ULQ5gWSWCLog.JPEG%2F20240603_151822.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
      ],
      regionId: 6,
      userId: 5,
    },
    {
      title: '제주할망밥상',
      content:
        '제주 안덕 생선구이맛집이예요. 가성비가 넘쳐흐르네요.생선구이랑 제육볶음까지 하나같이 다 맛있어요!사장님께서 상추도 직접 키우신다고 하셨는데 싱싱하고 맛있어요. 집밥같지만 집에선 절대 이맛을 낼 수 없는 맛집입니다.',
      imageUrl:
        'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMzEyMTZfODIg%2FMDAxNzAyNjg5MjAxNDY2.7FTG8t8wAVuDHzOBDtEZufTxlvRW18Xcj_yZWA4IhZkg.FM3pC5VLr2DgxlsVzLTS7JSMiLxjVX-dn9bz8GNVj4Qg.JPEG.yhc5884%2FIMG_1906.JPG',
      regionId: 6,
      userId: 2,
    },
    {
      title: '제주김만복김밥',
      content:
        '제주에서 김밥은 먹어야겠다고 sns볼때마다 생각했는데 후회는 없습니다. 진짜 부드럽고 오징어무침이랑 같이 시켜 먹으면 매운맛과 꼬득꼬득한 식감이 절 유혹하더라구요 왜 유명한지 알거같아요 간도 하나도 안찌서 초무침과의 만남이 아주 잘 어울리고',
      imageUrl:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MjRfMTY2%2FMDAxNzE2NTU5OTYxNzg0.MvWdis66NDeikN79B-ft1ne0PinuPAyciagUqydKkHkg.k5v8_zvmHP6IcXrDuw4J04iKQO2MzVUT6WL5V3gwbgsg.JPEG%2F20240519_123318.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
      regionId: 6,
      userId: 3,
    },
    {
      title: '최대게',
      content:
        '최대게는 다른 대게 집과는 다르게, 대게 밑에 인덕션으로 수중기를 만들어서 오래오래 따뜻한 대게를 먹을 수 있어서 좋았어요. 매장도 청결하고 상차림비가 아깝지 않게 밑반찬들이 알찼어요.\n특히 딱지 볶음밥이 넘 맛있었어요',
      imageUrl:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA2MDJfMTgz%2FMDAxNzE3MzAzOTY1MzQy.KEfPBduuGIDREShMbkhr2vgDJFqLdOvAL9h8O0Ly7scg.ttrfhCt8-p877PHGrDNjplWm61ZXZWEzdCTK4K0Gtr8g.JPEG%2F20240602_133331.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
      regionId: 5,
      userId: 1,
    },
    {
      title: '낙산물곰탕',
      content:
        '물곰탕 시원하고 칼칼하니 아주 맛있었어요. 살이 녹아버려서 씹을게없더라고요 소화도 잘되고 밥한끼 뚝딱입니다! 뽈락이 진짜 담백하고 비린맛없이 맛있었어요. 뜨거운 그릇에.지글지글하면서 나타나는데 진짜 맛있었어요.',
      imageUrl:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA0MDZfODEg%2FMDAxNzEyMzg2ODI1ODY4.xbxLCg2keTENOOMkenjLy1FK5A8J74GABhU_QzGQtHUg.axFZW87Put4yYb6iNCMLvrGY7eTpVu3AyP7O8WLFNysg.JPEG%2F97B15E26-1889-4C35-8700-7B5D6AC1812E.jpeg%3Ftype%3Dw1500_60_sharpen',
      regionId: 5,
      userId: 3,
    },
    {
      title: '우고집',
      content:
        '한두달에 한번씩은 가는 집근처 맛집이예요. 세트메뉴로 해서 구성이 여러부위를 적당하게 먹을수있어서 좋습니다. 매장이 약간 협소한 편이지만 안쪽으로 단체석도 있습니다. 고기먹고 나면 소찌개는 더 저렴하게 주문이 돼서 그것도 좋아요 ㅎㅎㅎ 소찌개 짱 맛있어용',
      imageUrl:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyMzA2MDdfMjcg%2FMDAxNjg2MTM3NDYyOTg0.2d86G61k76cKYRk6GcTSDCeunsHXW1xffH6Sj-4CrXAg.j6sL3wncJOOnCxD4n5kgohWTr84op6PHvdoMlr4gircg.JPEG%2FC09E2831-186B-41AD-AB04-212FF412B0F3.jpeg%3Ftype%3Dw1500_60_sharpen',
      regionId: 4,
      userId: 4,
    },
    {
      title: '오이식',
      content:
        '납작우동이라는 특이한 메뉴랑 가라아게동 양보고 너무 반했어요! 쯔유랑 땅콩소스도 너무 맛있고 바질페스토 넣어보라는 직원분 말씀에 넣어봤는데 잘 어울리네요 여기 분위기도 좋고 지브리 음악도 너무 좋아요',
      imageUrl:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA2MDZfMTcz%2FMDAxNzE3NjY0NTAxNjYz.HDKGm8cS6yNJhd92Bx5KdZYD__OzvK25y8iqpMmazxIg.NK85HzmLcgCnB_HqtcBJe7LCT4IxIpCu-7ieA7K9hgQg.JPEG%2F75921480-DE6E-4FCB-AC7F-19BCCDF57BC5.jpeg%3Ftype%3Dw1500_60_sharpen',
      regionId: 4,
      userId: 5,
    },
    {
      title: '윤이네수산',
      content:
        '부모님 모시고 갔는데 푸짐한 스끼다시에 무엇보다 해산물 완전 싱싱하고 매운탕도 정말 맛있어서 너무나 만족했습니다!',
      imageUrl:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA2MDVfMTk1%2FMDAxNzE3NTk1MDMzODE2.kD4UlB0Pl3lnuCJU0wPKJhZNgGmrd9M2KLatkLpzQ48g.jAGBX1MjJ9W6C4vgvs4MSQ5PueHC-Pd97JgDChg0hZ0g.JPEG%2F48F6CFF1-B5E2-4C61-BE2B-0367BE538C9F.jpeg%3Ftype%3Dw1500_60_sharpen',
      regionId: 3,
      userId: 2,
    },
    {
      title: '미도인 충장로',
      content:
        '스테이크 고기 질도 좋고 부드럽고 맛있었습니다! 쉬림프 로제 파스타도 일반 양식집보다 더 뛰어난 퀄리티의 맛입니다!! 새우도 신선하고, 양념도 맛있어요',
      imageUrl:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210402_8%2F1617350773158nfPE9_JPEG%2FDY7732kci68K7-sHuOOq5dVy.jpg',
      regionId: 3,
      userId: 4,
    },
    {
      title: '곰골식당',
      content:
        '제육 너무 맛있어요. 불맛 가득!! 가격도 너무 합리적이고 직원분들도 친절해요! 숭늉이 있어 두살 아기랑 같이 먹기도 좋았어요!!! 네시쯤 가니 대기없이 바로 들어갔어요. 막걸리도 깔끔하니 맛있었어용',
      imageUrl:
        'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA1MTNfMjM0%2FMDAxNzE1NTU1NTg0MTY2.nYcp9vodIrZ39SnvEa7zETm7WwYuRuEw2neNDDtVBIsg.quGOGKyH48GZjpNS2HqFDD__-18TH-tfwPHThdVxIEUg.JPEG%2FIMG_5711.jpg',
      regionId: 2,
      userId: 1,
    },
    {
      title: '풍미꽃게장게국지',
      content:
        '푸짐한 양에 달큰얼큰한 국물맛이 게국지맛이 일품입니다! 이른시간인데도 식사하는 분들도 많고 입맛까다론 저도 게국지에 두려움이있었는데 넘 맛있게 잘먹었습니다.',
      imageUrl:
        'https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyNDA1MjJfMjg3%2FMDAxNzE2MzcyNDAzNzA3.1QRU8nzmWrLDVANcjnk-EgxD5b6f8guJHYiGOn3YBfUg.OvE1UaXhPN0iL6gpwb8hAqtKO7VR0EZ1isumsZChLL0g.JPEG%2FIMG_0760.jpg',
      regionId: 2,
      userId: 5,
    },
    {
      title: '삼본식당',
      content:
        '가게도 깔끔 맛도 깔끔. 캡사이신매운멋 아니고 고춧가루 칼칼함이라 너무 좋았어요. 사장님 설명도 너무 친절했어요.',
      imageUrl:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDAzMTJfNTYg%2FMDAxNzEwMjE4MzEzOTk1.-svguhhPbh_zGmMlzQyakavneIjRg5Jh-CTVhiB9LMMg.Zunr5jlPA9fgCjfTL1aG--Hfa4u7EW-DdUk4HbSC2p8g.JPEG%2F20240312_133734.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
      regionId: 1,
      userId: 3,
    },
    {
      title: '팔뚝김밥',
      content:
        '김밥이!!진짜 팔뚝만합니다! 둘이가서 라볶이 김밥 세트 골랐는데 김밥 5개씩 맛별로 고를수있는점이 너무 좋아요 ㅠㅠ 라볶이는 약간 평범하지만 김밥이 진짜 최고네요! 이가격에 이맛이라니 너무 최곱니당',
      imageUrl:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA2MDFfMjI3%2FMDAxNzE3MjI0OTcyNjkz.hHinCpSlF6ZpR3eIK81EWDoPERV5DD3Oa5xhrMTTV40g.C3pi73IfWcuvwkiklLPbSoKLP0XJEXqoR7WHHOYVg00g.JPEG%2F20240601_155420.jpg.jpg%3Ftype%3Dw1500_60_sharpen',
      regionId: 1,
      userId: 4,
    },
    {
      title: '백향담',
      content:
        '단양 대표 떡갈비&석갈비 전문점.\n15년 동안 음식에 최선을 다한\n요리사가 만든 대표 음식들.\n여러가지 소고기 부위와\n돼지 부위를 적절히 섞어\n최상의 맛을 이끌어냈습니다.\n단양 마늘과 흑 마늘을 이용한\n단양만의 특색 있는 전문점 입니다.',
      imageUrl:
        'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220421_209%2F1650533262818hQnPA_JPEG%2FKakaoTalk_20220421_154817821.jpg',
      regionId: 2,
      userId: 1,
    },
    {
      title: '나누미 떡볶이',
      content:
        '단양 대표 떡갈비&석갈비 전문점.\n15년 동안 음식에 최선을 다한\n요리사가 만든 대표 음식들.\n여러가지 소고기 부위와\n돼지 부위를 적절히 섞어\n최상의 맛을 이끌어냈습니다.\n단양 마늘과 흑 마늘을 이용한\n단양만의 특색 있는 전문점 입니다.',
      imageUrl:
        'https://media-cdn.tripadvisor.com/media/photo-s/0f/e8/2b/2d/caption.jpg',
      regionId: 1,
      userId: 3,
    },
    {
      title: '남촌 가든',
      content:
        '원골유원지 내에 위치하고 있어 전국에서 찾아오는 관광객들로 붐비는 ‘남촌가든’. 매장 앞으로 흐르는 금강과 주위를 둘러싸고 있는 산이 멋스러운 운치를 살려준다. \n대표 메뉴 ‘빠가만어죽’은 잡고기를 쓰지 않고 오직 빠가사리로만 육수를 내 진한 국물 맛을 자랑한다. \n빠가사리 육수에 밥, 국수, 수제비, 생선살을 넣어 걸쭉하게 끓여 낸 어죽은 혀에 진득하게 달라붙으며 목을 타고 내려간다. \n국물의 구수한 맛이 밥알 하나하나 깊숙하게 스며들며 선사하는 짙은 감칠맛이 일품이다. \n민물 생선과 겨우 내 잘 말린 무청으로 시원한 맛을 살린 ‘빠가 매운탕’도 인기 메뉴다. \n탱글탱글한 민물 생선 살과 칼칼한 국물이 속을 뜨끈하게 달래준다.',
      imageUrl: 'https://img.siksinhot.com/article/1637718259960006.jpg',
      regionId: 2,
      userId: 4,
    },
    {
      title: '독천식당',
      content:
        '태양초를 즉석에서 갈아서 만드는 양념장에 낙지와 콩나물 등의 야채를 버무려 얹어내는 낙지 비빔밥으로 사랑받는 낙지 전문점입니다. \n통통하고 큰 사이즈의 낙지를 넣어 시원한 국물의 연포탕도 인기 메뉴 중 하나입니다.',
      imageUrl:
        'https://img.siksinhot.com/place/1424347584704831.jpg?w=307&h=300&c=Y',
      regionId: 3,
      userId: 5,
    },
    {
      title: '착한찜닭',
      content:
        '순살 주문하면 다 닭다리살로 나옴!\n\n이게 진짜 레전드!\n\n​\n\n닭 특유의 냄새도 하나도 안나고 부드럽고 촉촉함!',
      imageUrl:
        'https://mblogthumb-phinf.pstatic.net/MjAyNDAyMjlfMTU0/MDAxNzA5MTY4NjQ4MzI2.1mH41PVM_Q7wHY9hFJ8VhgX0mSj6gVjfB43ChQqRbUIg.A9w7syOa71PTghZObumP3U9ACzDrNi27HA-hJ1nwFFAg.JPEG/output_150816395.jpg?type=w800',
      regionId: 4,
      userId: 1,
    },
    {
      title: '엄지네 포장마차',
      content:
        '강릉에서 가장 유명한 음식점이라 5시 좀 안되어서 저녁 식사하러 방문했어요. 꼬막비빔밥과 오징어순대를 주문했는데 너무나 맛있네요^^ 꼬막무침비빔밥은 공깃밥을 추가로 주문했어요. 양이 매우 든든합니다. 꼬막비빔밥에다가 김 싸먹으니 완전 맛있네요. 신선한 꼬막에 살짝 매콤 짭짜름한 맛에 참기름향이 가득해서 밥도둑 메뉴네요. 함께 나오는 반찬들도 미역국을 포함해서 무난하게 먹을수 있는곳이에요. 손님이 많더라도 테이블이 많아 회전율이 좋아 긴 대기 시간 없이 먹을수 있네요. 근처에 식당 전용 주차장이 있기는 합니다.👍 강릉에 수많은 맛집들을 방문했지만 재방문하고 싶은곳은 얼마 안되는데 이곳은 괜찮네요. 여기 육사시미도 유명한것 같은데 다음에 와서 먹어봐야겠네요!^^',
      imageUrl:
        'https://foodandtrip.kr/wp-content/uploads/2024/02/image-18.png',
      regionId: 5,
      userId: 2,
    },
    {
      title: '한성오메기떡',
      content:
        '제주 동문시장의 한성 오메기떡에서는 제주산 차조를 사용해 만든 떡에 팥과 콩고물, 견과류를 묻힌 뒤 먹기 좋게 하나씩 포장해 팔고 있어요. 제주의 특산물이라고도 할 수 있는 오메기떡은 달지 않고 담백한 맛 덕분에 건강 간식으로도 인기가 많아요. 특히 이곳은 다른 곳과 달리 팥 앙금 등에 전부 국내산 팥을 사용하는 데다 공항과 가까워서 선물용으로도 추천해요.',
      imageUrl:
        'https://goguides.azureedge.net/media/5vjdgqlj/d5b14d76-64bd-4d60-af50-0504860f0f96.jpg?anchor=center&mode=crop&width=1600&height=1066&quality=50',
      regionId: 6,
      userId: 3,
    },
    {
      title: '나누미 떡볶이',
      content:
        '한양대생의 사랑을 독차지하고 있는 원탑 떡볶이 맛집이다.\n바삭한 튀김에 계란까지 꼭 먹어줘야 한다. 떡볶이는 1인분에 3,500원.\n상당히 쫄깃함을 자랑하는 쌀떡볶이는 자꾸자꾸 생각나는 맛이라고.\n방송을 타고 나간 맛집이라 웨이팅이 꽤 있는편이다.',
      imageUrl:
        'https://d12zq4w4guyljn.cloudfront.net/750_750_20240330095612_photo1_4b937aee6e37.jpg',
      regionId: 1,
      userId: 4,
    },
    {
      title: '무궁화 식당',
      content:
        '‘무궁화식당’은 2대째 전통 수제 방식으로 순대를 만들어 오고 있는 순대 요리 전문점이다. \n도축장을 직접 방문하여 신선한 내장과 고기를 공수해온다. \n음식을 주문하면 도톰하게 썬 돼지 귀를 매콤한 양념에 버무려 나오는 ‘귀때기 무침’이 서비스로 나와 입맛을 돋워준다. \n대표 메뉴는 국내산 돼지고기와 돼지 뼈만 넣고 오랜 시간 끓여 깊은 국물 맛을 완성한 ‘다가진 국밥’. 뽀얀 자태를 뽐내는 육수 안에 수제 순대, 머리 고기, 내장이 푸짐하게 들어있어 푸짐함을 더한다. \n돼지의 육향을 은은하게 머금은 국물은 잡내 없이 깔끔하게 떨어지는 국물 맛이 돋보인다. \n순대, 버섯, 쫄면사리, 곱창 등 갖은 재료에 고추장 양념을 풀어 자작하게 끓여 먹는 ‘곱창전골’도 얼큰한 맛 덕에 안주 메뉴로 인기다.',
      imageUrl: 'https://img.siksinhot.com/article/1637718774016035.jpg',
      regionId: 2,
      userId: 5,
    },
    {
      title: '황솔촌 충장점',
      content:
        '생돼지갈비, 물냉면, 비빔냉면, 비빔수육쟁반, 비빔밥 등을 맛 볼 수 있습니다. \n특히 양념 돼지갈비가 주력인데, 인공적인 단맛이 아니라 천연의 단맛을 느낄 수 있어 더욱 좋습니다. \n고기를 먹은 후 입가심으로 먹는 냉면도 일품입니다.',
      imageUrl:
        'https://img.siksinhot.com/place/1462954340499100.jpg?w=307&h=300&c=Y',
      regionId: 3,
      userId: 1,
    },
    {
      title: '오아스시',
      content:
        '카페같은 외관과 인테리어가 돋보이는 영남대 오아스시입니다. 합리적인 가격으로 스시를 맛볼 수 있어 인기가 많은 곳입니다. 깔끔한 인테리어와 정갈한 음식들이 마음을 사로잡는 곳입니다.',
      imageUrl:
        'https://img.siksinhot.com/story/1528718338042022.jpeg?w=307&h=300&c=Y',
      regionId: 4,
      userId: 2,
    },
    {
      title: '해미가',
      content:
        '자리에 앉아 물회를 주문하면 제일먼저 미역국과 야채전이 나오고 바로 보쌈과 물회가 나옵니다. 소면과 공기밥도 나오는데 양은 적지만 적당하다고 생각됩니다. 배가불러서 야채전은 얼마 못먹고 남겼습니다. 야채전은 거의 튀김수준으로 바삭하고 두툼하며 고소합니다. 야채전을 먼저 비운다면 나머지를 다 못 먹을 수 있습니다. 보쌈은 새콤달콤 채소무침이랑 같이 나오는데 별미입니다. 보쌈고기도 부드럽습니다. 물회는 광어물회인듯 했으며 회도 푸짐하게 들어있습니다. 무엇보다 물회가 많이 시지도않고 맵지도않아서 자꾸 댕기는 맛입니다. 두명이서 물회 2인분을 드신다면 가성비로는 좋습니다. 얼마전까지는 물회가 1인 15,000원이었는데 최근에 17,000원으로 인상된듯합니다. 그렇지만 충분히 비용지불하고 주말에는 대기가 한시간씩 걸린다는데 이해가 가는 곳입니다. 강릉와서 맛있게 먹고갑니다.',
      imageUrl:
        'https://foodandtrip.kr/wp-content/uploads/2024/02/image-19.png',
      regionId: 5,
      userId: 4,
    },
    {
      title: '산방식당',
      content:
        '제주도민 사이의 인기 맛집이라는 산방식당은 제주 밀면으로 유명해요. 통통한 밀면을 군침 도는 양념장에 비빈 비빔 밀면이나 육수를 부어 내오는 밀 냉면이 대표 메뉴예요. 돼지고기가 유명한 제주도답게 면 위에 고기가 얹어 나오는데, 이 고기를 면으로 감싸서 먹어 보세요. 면과 고기가 입안에서 함께 씹히는 식감은 색다른 먹는 재미를 줘요. 고기 덕분에 면이라도 속이 꽤 든든해질 거예요.',
      imageUrl:
        'https://goguides.azureedge.net/media/xn0czgm5/7fbbda47-8704-4f7c-8d3a-cc5e153aaa08.jpg?anchor=center&mode=crop&width=1600&height=1066&quality=50',
      regionId: 6,
      userId: 1,
    },
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
  }

  console.log('Post 생성 완료:');

  const comments = [
    {
      userId: 3,
      postId: 10,
      comment: '맛있어 보이네요!',
      createdAt: '2024-06-07T10:30:00.000Z',
      updatedAt: '2024-06-07T10:30:00.000Z',
    },
    {
      userId: 1,
      postId: 19,
      comment: '이 가게는 어디에 위치해 있나요?',
      createdAt: '2024-06-06T15:45:00.000Z',
      updatedAt: '2024-06-06T15:45:00.000Z',
    },
    {
      userId: 5,
      postId: 7,
      comment: '정말 멋진 가게인 것 같아요!',
      createdAt: '2024-06-05T09:20:00.000Z',
      updatedAt: '2024-06-05T09:20:00.000Z',
    },
    {
      userId: 2,
      postId: 15,
      comment: '이런 곳을 찾고 있었어요. 감사합니다!',
      createdAt: '2024-06-04T14:10:00.000Z',
      updatedAt: '2024-06-04T14:10:00.000Z',
    },
    {
      userId: 4,
      postId: 20,
      comment: '다음에 꼭 가봐야겠어요!',
      createdAt: '2024-06-03T20:55:00.000Z',
      updatedAt: '2024-06-03T20:55:00.000Z',
    },
    {
      userId: 3,
      postId: 10,
      comment: '맛있어 보이네요!',
      createdAt: '2024-06-07T10:30:00.000Z',
      updatedAt: '2024-06-07T10:30:00.000Z',
    },
    {
      userId: 1,
      postId: 19,
      comment: '이 가게는 어디에 위치해 있나요?',
      createdAt: '2024-06-06T15:45:00.000Z',
      updatedAt: '2024-06-06T15:45:00.000Z',
    },
    {
      userId: 5,
      postId: 7,
      comment: '정말 멋진 가게인 것 같아요!',
      createdAt: '2024-06-05T09:20:00.000Z',
      updatedAt: '2024-06-05T09:20:00.000Z',
    },
    {
      userId: 2,
      postId: 15,
      comment: '이런 곳을 찾고 있었어요. 감사합니다!',
      createdAt: '2024-06-04T14:10:00.000Z',
      updatedAt: '2024-06-04T14:10:00.000Z',
    },
    {
      userId: 4,
      postId: 20,
      comment: '다음에 꼭 가봐야겠어요!',
      createdAt: '2024-06-03T20:55:00.000Z',
      updatedAt: '2024-06-03T20:55:00.000Z',
    },
    {
      userId: 4,
      postId: 21,
      comment: '이 가게 정말 인기가 많네요!',
      createdAt: '2024-06-02T12:25:00.000Z',
      updatedAt: '2024-06-02T12:25:00.000Z',
    },
    {
      userId: 3,
      postId: 22,
      comment: '음식이 정말 맛있어 보여요!',
      createdAt: '2024-06-01T08:40:00.000Z',
      updatedAt: '2024-06-01T08:40:00.000Z',
    },
    {
      userId: 2,
      postId: 23,
      comment: '가격도 착하고 좋은 곳 같아요!',
      createdAt: '2024-05-31T17:15:00.000Z',
      updatedAt: '2024-05-31T17:15:00.000Z',
    },
    {
      userId: 1,
      postId: 24,
      comment: '여기는 분위기가 정말 좋네요!',
      createdAt: '2024-05-30T22:00:00.000Z',
      updatedAt: '2024-05-30T22:00:00.000Z',
    },
    {
      userId: 4,
      postId: 25,
      comment: '다음에 꼭 가봐야겠어요!',
      createdAt: '2024-05-29T19:30:00.000Z',
      updatedAt: '2024-05-29T19:30:00.000Z',
    },
    {
      userId: 3,
      postId: 26,
      comment: '맛집으로 소문난 곳이네요!',
      createdAt: '2024-05-28T14:50:00.000Z',
      updatedAt: '2024-05-28T14:50:00.000Z',
    },
    {
      userId: 2,
      postId: 27,
      comment: '다양한 음식이 있어서 좋아요!',
      createdAt: '2024-05-27T11:20:00.000Z',
      updatedAt: '2024-05-27T11:20:00.000Z',
    },
    {
      userId: 1,
      postId: 28,
      comment: '분위기가 아주 좋은 가게인 것 같아요!',
      createdAt: '2024-05-26T16:45:00.000Z',
      updatedAt: '2024-05-26T16:45:00.000Z',
    },
    {
      userId: 5,
      postId: 29,
      comment: '가격 대비 정말 좋은 곳이네요!',
      createdAt: '2024-05-25T21:10:00.000Z',
      updatedAt: '2024-05-25T21:10:00.000Z',
    },
    {
      userId: 4,
      postId: 30,
      comment: '여기 음식이 정말 맛있어요!',
      createdAt: '2024-05-24T18:35:00.000Z',
      updatedAt: '2024-05-24T18:35:00.000Z',
    },
    {
      userId: 3,
      postId: 31,
      comment: '분위기도 좋고 음식도 맛있어요!',
      createdAt: '2024-05-23T13:55:00.000Z',
      updatedAt: '2024-05-23T13:55:00.000Z',
    },
    {
      userId: 1,
      postId: 32,
      comment: '맛있는 음식이 있는 곳 같아요!',
      createdAt: '2024-05-22T09:10:00.000Z',
      updatedAt: '2024-05-23T13:55:00.000Z',
    },
    {
      userId: 2,
      postId: 33,
      comment:
        '이 음식점에 들어서면 마치 맛있는 향기가 나는 마법의 세계로 들어온 것 같아요!',
      createdAt: '2024-05-21T17:25:00.000Z',
      updatedAt: '2024-05-21T17:25:00.000Z',
    },
    {
      userId: 1,
      postId: 34,
      comment:
        '이 식당은 고객들에게 맛있는 음식을 제공할 때마다, 우리들의 신체에 에너지를 더해줄 것 같아요!',
      createdAt: '2024-05-20T14:40:00.000Z',
      updatedAt: '2024-05-20T14:40:00.000Z',
    },
    {
      userId: 4,
      postId: 35,
      comment:
        '이 음식점은 마치 우주선처럼 달라붙은 것 같아요! 이곳에서의 경험은 정말 우리의 삶을 환타지틱하게 만들어줄 거에요!',
      createdAt: '2024-05-19T11:55:00.000Z',
      updatedAt: '2024-05-19T11:55:00.000Z',
    },
    {
      userId: 3,
      postId: 26,
      comment:
        '이 식당은 내가 먹은 음식 중에서 제일 행복한 맛이었어요! 감탄이 절로 나오더라구요!',
      createdAt: '2024-05-18T08:10:00.000Z',
      updatedAt: '2024-05-18T08:10:00.000Z',
    },
    {
      userId: 2,
      postId: 37,
      comment:
        '이 식당의 맛있는 음식을 한 입 먹으면 마치 하늘을 날고 있는 기분이 들었어요! 너무 행복해졌어요!',
      createdAt: '2024-05-17T20:25:00.000Z',
      updatedAt: '2024-05-17T20:25:00.000Z',
    },
    {
      userId: 3,
      postId: 38,
      comment:
        '이 식당은 마치 페어리테일의 세계에서 나온 것 같아요! 신비로움이 가득한 곳이에요!',
      createdAt: '2024-05-16T15:40:00.000Z',
      updatedAt: '2024-05-16T15:40:00.000Z',
    },
    {
      userId: 4,
      postId: 39,
      comment:
        '이 식당은 고객들에게 먹는 즐거움을 더하기 위해 마법을 부린 것 같아요! 너무 맛있어요!',
      createdAt: '2024-05-15T12:55:00.000Z',
      updatedAt: '2024-05-15T12:55:00.000Z',
    },
    {
      userId: 3,
      postId: 40,
      comment:
        '이 음식점은 나의 식탐을 억제할 수 없게 만들어버렸어요! 정말 맛있어요!',
      createdAt: '2024-05-14T10:10:00.000Z',
      updatedAt: '2024-05-14T10:10:00.000Z',
    },
    {
      userId: 2,
      postId: 41,
      comment:
        '이 식당은 맛있는 음식을 먹으면서 마치 행복이 내 몸을 휘감는 것 같아요! 정말 최고에요!',
      createdAt: '2024-05-13T07:25:00.000Z',
      updatedAt: '2024-05-13T07:25:00.000Z',
    },
    {
      userId: 4,
      postId: 42,
      comment:
        '이 음식점은 마치 요정의 성 같아요! 정말 맛있는 음식이 있는 마법의 장소에 와 있는 것 같아요!',
      createdAt: '2024-05-12T04:40:00.000Z',
      updatedAt: '2024-05-12T04:40:00.000Z',
    },
    {
      userId: 2,
      postId: 43,
      comment:
        '이 식당은 마치 맛있는 음식이 넘쳐나는 지구 외 행성에서 온 것 같아요! 정말 신기해요!',
      createdAt: '2024-05-11T01:55:00.000Z',
      updatedAt: '2024-05-11T01:55:00.000Z',
    },
    {
      userId: 3,
      postId: 44,
      comment:
        '이 음식점은 마치 맛있는 음식을 먹으면 마법을 부린 것처럼 행복해지는 곳이에요! 정말 멋져요!',
      createdAt: '2024-05-10T22:10:00.000Z',
      updatedAt: '2024-05-10T22:10:00.000Z',
    },
    {
      userId: 5,
      postId: 40,
      comment:
        '이 음식점은 마치 맛있는 음식을 먹으면 마법을 부린 것처럼 행복해지는 곳이에요! 정말 멋져요!',
      createdAt: '2024-05-10T22:10:00.000Z',
      updatedAt: '2024-05-10T22:10:00.000Z',
    },
  ];
  for (const comment of comments) {
    await prisma.comment.create({ data: comment });
  }

  console.log('댓글 생성 완료:');

  const follows = [
    {
      followerId: 1,
      followedId: 2,
      createdAt: '2024-06-07T10:30:00.000Z',
      updatedAt: '2024-06-07T10:30:00.000Z',
    },
    {
      followerId: 2,
      followedId: 3,
      createdAt: '2024-06-06T15:45:00.000Z',
      updatedAt: '2024-06-06T15:45:00.000Z',
    },
    {
      followerId: 3,
      followedId: 4,
      createdAt: '2024-06-05T09:20:00.000Z',
      updatedAt: '2024-06-05T09:20:00.000Z',
    },
    {
      followerId: 4,
      followedId: 5,
      createdAt: '2024-06-04T14:10:00.000Z',
      updatedAt: '2024-06-04T14:10:00.000Z',
    },
    {
      followerId: 5,
      followedId: 1,
      createdAt: '2024-06-03T20:55:00.000Z',
      updatedAt: '2024-06-03T20:55:00.000Z',
    },
  ];
  for (const followe of follows) {
    await prisma.follows.create({ data: followe });
  }

  console.log('팔로우 생성 완료:');

  const postLikes = [
    {
      userId: 1,
      postId: 1,
      createdAt: '2024-06-07T12:00:00.000Z',
      updatedAt: '2024-06-07T12:00:00.000Z',
    },
    {
      userId: 2,
      postId: 2,
      createdAt: '2024-06-07T12:01:00.000Z',
      updatedAt: '2024-06-07T12:01:00.000Z',
    },
    {
      userId: 3,
      postId: 3,
      createdAt: '2024-06-07T12:02:00.000Z',
      updatedAt: '2024-06-07T12:02:00.000Z',
    },
    {
      userId: 4,
      postId: 4,
      createdAt: '2024-06-07T12:03:00.000Z',
      updatedAt: '2024-06-07T12:03:00.000Z',
    },
    {
      userId: 5,
      postId: 5,
      createdAt: '2024-06-07T12:04:00.000Z',
      updatedAt: '2024-06-07T12:04:00.000Z',
    },
    {
      userId: 1,
      postId: 6,
      createdAt: '2024-06-07T12:05:00.000Z',
      updatedAt: '2024-06-07T12:05:00.000Z',
    },
    {
      userId: 2,
      postId: 7,
      createdAt: '2024-06-07T12:06:00.000Z',
      updatedAt: '2024-06-07T12:06:00.000Z',
    },
    {
      userId: 3,
      postId: 8,
      createdAt: '2024-06-07T12:07:00.000Z',
      updatedAt: '2024-06-07T12:07:00.000Z',
    },
    {
      userId: 4,
      postId: 9,
      createdAt: '2024-06-07T12:08:00.000Z',
      updatedAt: '2024-06-07T12:08:00.000Z',
    },
    {
      userId: 5,
      postId: 10,
      createdAt: '2024-06-07T12:09:00.000Z',
      updatedAt: '2024-06-07T12:09:00.000Z',
    },
    {
      userId: 1,
      postId: 11,
      createdAt: '2024-06-07T12:10:00.000Z',
      updatedAt: '2024-06-07T12:10:00.000Z',
    },
    {
      userId: 2,
      postId: 12,
      createdAt: '2024-06-07T12:11:00.000Z',
      updatedAt: '2024-06-07T12:11:00.000Z',
    },
    {
      userId: 3,
      postId: 13,
      createdAt: '2024-06-07T12:12:00.000Z',
      updatedAt: '2024-06-07T12:12:00.000Z',
    },
    {
      userId: 4,
      postId: 14,
      createdAt: '2024-06-07T12:13:00.000Z',
      updatedAt: '2024-06-07T12:13:00.000Z',
    },
    {
      userId: 5,
      postId: 15,
      createdAt: '2024-06-07T12:14:00.000Z',
      updatedAt: '2024-06-07T12:14:00.000Z',
    },
    {
      userId: 1,
      postId: 16,
      createdAt: '2024-06-07T12:15:00.000Z',
      updatedAt: '2024-06-07T12:15:00.000Z',
    },
    {
      userId: 2,
      postId: 17,
      createdAt: '2024-06-07T12:16:00.000Z',
      updatedAt: '2024-06-07T12:16:00.000Z',
    },
    {
      userId: 3,
      postId: 18,
      createdAt: '2024-06-07T12:17:00.000Z',
      updatedAt: '2024-06-07T12:17:00.000Z',
    },
    {
      userId: 4,
      postId: 19,
      createdAt: '2024-06-07T12:18:00.000Z',
      updatedAt: '2024-06-07T12:18:00.000Z',
    },
    {
      userId: 5,
      postId: 20,
      createdAt: '2024-06-07T12:19:00.000Z',
      updatedAt: '2024-06-07T12:19:00.000Z',
    },
    {
      userId: 1,
      postId: 21,
      createdAt: '2024-06-07T12:20:00.000Z',
      updatedAt: '2024-06-07T12:20:00.000Z',
    },
    {
      userId: 2,
      postId: 22,
      createdAt: '2024-06-07T12:21:00.000Z',
      updatedAt: '2024-06-07T12:21:00.000Z',
    },
  ];
  for (const postLike of postLikes) {
    await prisma.like.create({ data: postLike });
  }

  console.log('게시글 좋아요 생성 완료:');

  const commentLikes = [
    {
      userId: 1,
      postId: 1,
      commentId: 1,
      createdAt: '2024-06-07T12:00:00.000Z',
      updatedAt: '2024-06-07T12:00:00.000Z',
    },
    {
      userId: 2,
      postId: 2,
      commentId: 2,
      createdAt: '2024-06-07T12:01:00.000Z',
      updatedAt: '2024-06-07T12:01:00.000Z',
    },
    {
      userId: 3,
      postId: 3,
      commentId: 3,
      createdAt: '2024-06-07T12:02:00.000Z',
      updatedAt: '2024-06-07T12:02:00.000Z',
    },
    {
      userId: 4,
      postId: 4,
      commentId: 4,
      createdAt: '2024-06-07T12:03:00.000Z',
      updatedAt: '2024-06-07T12:03:00.000Z',
    },
    {
      userId: 5,
      postId: 5,
      commentId: 5,
      createdAt: '2024-06-07T12:04:00.000Z',
      updatedAt: '2024-06-07T12:04:00.000Z',
    },
    {
      userId: 1,
      postId: 6,
      commentId: 6,
      createdAt: '2024-06-07T12:05:00.000Z',
      updatedAt: '2024-06-07T12:05:00.000Z',
    },
    {
      userId: 2,
      postId: 7,
      commentId: 7,
      createdAt: '2024-06-07T12:06:00.000Z',
      updatedAt: '2024-06-07T12:06:00.000Z',
    },
    {
      userId: 3,
      postId: 8,
      commentId: 8,
      createdAt: '2024-06-07T12:07:00.000Z',
      updatedAt: '2024-06-07T12:07:00.000Z',
    },
    {
      userId: 4,
      postId: 9,
      commentId: 9,
      createdAt: '2024-06-07T12:08:00.000Z',
      updatedAt: '2024-06-07T12:08:00.000Z',
    },
    {
      userId: 5,
      postId: 10,
      commentId: 10,
      createdAt: '2024-06-07T12:09:00.000Z',
      updatedAt: '2024-06-07T12:09:00.000Z',
    },
    {
      userId: 1,
      postId: 11,
      commentId: 11,
      createdAt: '2024-06-07T12:10:00.000Z',
      updatedAt: '2024-06-07T12:10:00.000Z',
    },
    {
      userId: 2,
      postId: 12,
      commentId: 12,
      createdAt: '2024-06-07T12:11:00.000Z',
      updatedAt: '2024-06-07T12:11:00.000Z',
    },
    {
      userId: 3,
      postId: 13,
      commentId: 13,
      createdAt: '2024-06-07T12:12:00.000Z',
      updatedAt: '2024-06-07T12:12:00.000Z',
    },
    {
      userId: 4,
      postId: 14,
      commentId: 14,
      createdAt: '2024-06-07T12:13:00.000Z',
      updatedAt: '2024-06-07T12:13:00.000Z',
    },
    {
      userId: 5,
      postId: 15,
      commentId: 15,
      createdAt: '2024-06-07T12:14:00.000Z',
      updatedAt: '2024-06-07T12:14:00.000Z',
    },
    {
      userId: 1,
      postId: 16,
      commentId: 16,
      createdAt: '2024-06-07T12:15:00.000Z',
      updatedAt: '2024-06-07T12:15:00.000Z',
    },
    {
      userId: 2,
      postId: 17,
      commentId: 17,
      createdAt: '2024-06-07T12:16:00.000Z',
      updatedAt: '2024-06-07T12:16:00.000Z',
    },
    {
      userId: 3,
      postId: 18,
      commentId: 18,
      createdAt: '2024-06-07T12:17:00.000Z',
      updatedAt: '2024-06-07T12:17:00.000Z',
    },
    {
      userId: 4,
      postId: 19,
      commentId: 19,
      createdAt: '2024-06-07T12:18:00.000Z',
      updatedAt: '2024-06-07T12:18:00.000Z',
    },
    {
      userId: 5,
      postId: 20,
      commentId: 20,
      createdAt: '2024-06-07T12:19:00.000Z',
      updatedAt: '2024-06-07T12:19:00.000Z',
    },
    {
      userId: 1,
      postId: 21,
      commentId: 21,
      createdAt: '2024-06-07T12:20:00.000Z',
      updatedAt: '2024-06-07T12:20:00.000Z',
    },
    {
      userId: 2,
      postId: 22,
      commentId: 22,
      createdAt: '2024-06-07T12:21:00.000Z',
      updatedAt: '2024-06-07T12:22:00.000Z',
    },
  ];
  for (const commentLike of commentLikes) {
    await prisma.commentLike.create({ data: commentLike });
  }

  console.log('댓글 좋아요 생성 완료:');
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
