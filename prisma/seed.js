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
        "title": "백향담",
        "content": "단양 대표 떡갈비&석갈비 전문점. 15년 동안 음식에 최선을 다한 요리사가 만든 대표 음식들. 여러가지 소고기 부위와 돼지 부위를 적절히 섞어 최상의 맛을 이끌어냈습니다. 단양 마늘과 흑 마늘을 이용한 단양만의 특색 있는 전문점 입니다.",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220421_209%2F1650533262818hQnPA_JPEG%2FKakaoTalk_20220421_154817821.jpg"],
        "regionId": 2,
        "userId": 1
      },
      {
        "title": "한버들떡갈비",
        "content": "제천에 있는 명물 한방 약재로 만든 수제 떡갈비!! 청풍호의 청정 자연이 깃드는 시간, 넓은 주차공간과 전기차 충전소도 마련되어 있습니다. 먹는 이의 행복을 기원하며 음식을 빚은 정성이 모여 슬로우푸드를 만듭니다.\n자연에서 얻은 원재료에 대해 다시 한 번 생각하며\n시간과 노력으로 만들어진 음식의 소중함을 알고 함께 하는 사람들과 즐겁게 식사하세요.\n그 순간 한버들에서 드시는 음식이 세상에서 가장 맛있는 슬로우푸드가 됩니다.",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA0MDFfMjkw%2FMDAxNzExOTYwMTMzOTgx.gIle13LedSmDOGJP3fGOd4JQlZqTzQZvHuqAt4_LYFgg.FJKKbwSu4mZjvWYgCsFoZxP8VapaRKXkgf4tG1BDjwEg.JPEG%2FE38C9F16-5F5A-4030-9E6D-63447084D38C.jpeg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 2,
        "userId": 2
      },
      {
        "title": "단양민물매운탕쏘가리",
        "content": "단양군의 명물 먹거리인 쏘가리매운탕, 쏘가리회, 마늘떡갈비를 중심으로 맛볼 수 있는 단양 맛집, 단양민물매운탕쏘가리 입니다. 지하 후면 30대 주차장 완비 단체분들이 와도 넉넉히 앉을 수 있는 공간입니다.",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221214_102%2F1670994637738oCf6i_PNG%2FKakaoTalk_20221214_140624101.png"],
        "regionId": 2,
        "userId": 1
      },
      {
        "title": "진주집",
        "content": "주말 점심시간에 방문 하니 대기줄이 길어요 그래도 회전율이 빨라서 20분만에 줄이 빨리 빠지는 편입니다 육개장칼국수는 4월말까지만 먹을수있다고 하여 닭칼국수 맛있게 먹었습니다 닭칼국수에 들어있는 만두도 맛있고 김치도 달달하니 맛있어요",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20150817_167%2F14398056264455qtod_JPEG%2F166767593044276_1.jpg"],
        "regionId": 1,
        "userId": 2
      },
      {
        "title": "광화문미진",
        "content": "1952년부터 광화문 일대를 지켜온 터줏대감인 미진은 한국식 냉메밀국수 전문점으로, 일본식 소바 쯔유보다 진한 맛의 간장 육수와 더 쫄깃한 식감의 메밀 면발을 선보인다. 식당 지하에 운영하는 공장에서 육수와 면을 직접 생산해 손님들에게 바로바로 제공한다. 한 주전자 가득 담긴 차가운 육수와 테이블마다 인심 좋게 제공하는 메밀국수 고명은 기호에 따라 가감이 가능하다. 숙주와 두부, 신김치와 돼지고기 소로 채운 메밀전병 역시 이 집의 인기 메뉴인데, 1인분의 반인 한 줄씩도 판매합니다.",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA2MDRfMjc2%2FMDAxNzE3NTExMDk1MTY1.85TmGQVtbvytvJJd_bhypzCvYr6Y7vT5ITYIDpJ0hbUg.ryPJ63WsCTaR4GHyNFpILz-iF5aen4in0HEfd5-RqVQg.JPEG%2F69E1A37E-BF3E-46BA-BD57-D0D081F6CBAE.jpeg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 1,
        "userId": 1
      },
      {
        "title": "유명산흥부네솥뚜껑닭볶음탕",
        "content": "예전에 산골농원에 사람이 많아서 그 옆에 있는 이곳에 와서 먹었었는데 그때보다 맛도 좋아지고 시설도 좋아졌네요! 테이블당 최소 3인으로 시켜야하지만 둘이 충분히 배불리 먹을 수 있어요~ 자알 먹고 가요!",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MzFfMTIy%2FMDAxNzE3MTE1NTMxMjk0.WH6rGQGkbcfImSMFp8sbBL2Fxy-0pSrs9nwAdwffSqQg.qveAng5SBCzFU0ZLWDu-O6mmY2LJQ43y2q8C0sPRMl8g.JPEG%2FBF81BAB1-22F9-43AF-A7B2-B4896E8C29E6.jpeg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 1,
        "userId": 1
      },
      {
        "title": "예향식당",
        "content": "광주 호남동에 위치한 한식당입니다. 게장, 닭장조림, 나물, 생선구이, 국, 전, 무침 등 20여가지의 반찬을 함께 맛볼 수 있는 백반이 대표적인 메뉴인데요. 인근 직장인들이 많이 찾는 곳이지요.",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MDJfMjYg%2FMDAxNzE0NjI3OTg2MjQ4.CGeXp58FnOSULzDAdRCJX3nLGyd60PwRqzqXl-EEF98g.kVpX_ax1lmFuP81qt4FEes1wkO-xfU85OMw2KHulZSQg.JPEG%2FIMG_9843.jpeg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 3,
        "userId": 1
      },
      {
        "title": "초가집",
        "content": "이 집 갈치조림 맛집이네요! 다른 음식도 모두 다 맛있지만 갈치조림에 무랑 감자도 넉넉히 넣어주시고 간도 적당히 배어서 정말 맛있게 먹었습니다. 다른 반찬도 모두 깔끔하고 맛있어요.",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MDFfMjIg%2FMDAxNzE0NTMyMzIwNjIz.gBxX7f0QnTTeK26A8LuB6Q68uwQEVG243XG4RhmTOWcg.ovJ7JlG_taq35m3Y_cRPntV2G62Pu0wXKOEKxhj0X1Mg.JPEG%2F2B4DED74-D461-4EF7-8760-DA74FADA3E27.jpeg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 3,
        "userId": 1
      },
      {
        "title": "해남식당",
        "content": "바지락해장국과 계란말이 먹었어요 바지락해장국 완전맛있어요 국물이 시원합니다 계란말이도 맛있어요",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA0MjVfMTk4%2FMDAxNzE0MDUwOTE3Njcz.MvJo-y4JTnoCvEVR45gn5oMq0Clc9bpS0bfC4VORy_4g.e3-HoTN5UcQc3fxBEaPGkSE5_trCYCTM3V7xV77Dw4wg.JPEG%2F20240425_112022.jpg.jpg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 3,
        "userId": 2
      },
      {
        "title": "향화정",
        "content": "꼬막비빔밥이 주력인것 같아서 꼬막비빔밥이랑 경주왔으니 육회물회도 시켰어요 꼬막비빔밥 진짜 맛있었어요!! 꼬막 양도 엄청 많고! 육회물회는 얼음이 녹을수록 더 맛있어지더라구요. 월요일 점심이라 5~10분내로 바로 입장했고 여기오길 잘했다 생각했습니다. 맛있게 잘 먹고 왔어요",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20240111_33%2F1704932199310QYkMH_JPEG%2FKakaoTalk_Photo_2024-01-11-09-15-51_002jpeg.jpeg"],
        "regionId": 4,
        "userId": 1
      },
      {
        "title": "대풍관",
        "content": "계절에 따라 다른메뉴가 너무 좋았어요 겨울엔 굴세트 봄.여름엔 생생물회세트가 너무 좋아요 날씨가 화창하고 더운날이라 더 좋았던것같아요 아침겸 이른점심으로 일찍 방문했더니 손님이 많지 않아 좋았어요 음식이 너무 맛있는데 배가 너무 불러 다 먹을 수 없어서 남기고 오는게 아쉬웠어요",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA0MDhfMTYx%2FMDAxNzEyNTg0NzY4ODg4.nyOYDn6BmKozMv9oJvZ0WYY6vbaXUC8oJLaD16L3iN8g.2-XeMq1M7akQLQNuesdjVwda8xymgPCqM6SrCeOT9LAg.JPEG%2F0D000FBC-3E37-4FC3-A5BC-0C240CD903F0.jpeg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 4,
        "userId": 2
      },
      {
        "title": "수변최고돼지국밥",
        "content": "부산 광안리 돼지국밥맛집 수변최고돼지국밥 본점에 다녀왔습니다 가격에 어울리는 살코기의양과 맛보기순대도 실해서 혼자가서 배부르게 먹고왔습니다 셀프바도 있어 모자란건 바로 가져와 먹을수있으니 역시 최고입니다!!! 음식이 맛있어요재료가 신선해요양이 많아요특별한 메뉴가 있어요",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MzFfMjE4%2FMDAxNzE3MTU3MzkyNTA5.sQtJxrZo3L40e7mfYX0RGSzFzYfS86mMb02O0f-qEpUg.Oyzp9nsP1rzwKdSf3Dl1smukbAQlVeG23PngiMEkldkg.JPEG%2F20240531_120824.jpg.jpg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 4,
        "userId": 2
      },
      {
        "title": "강릉꼬막비빔밥 풍호맛뜨락",
        "content": "강릉 맛집 찾다 왔어요~ 다른곳도 있었지만 수육이 매략적이라 왔는데 후회없네요 꼬막 비빔밥은 당연히 맛있구 수육도 부드럽고 물회도 적당한 새콤함에 넘 시원하네요 먼길 왔는데 힐링하고 갑니다",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20231109_8%2F1699507256918yhXx7_JPEG%2Ftemp_file.jpg"],
        "regionId": 5,
        "userId": 1
      },
      {
        "title": "고씨네동해막국수",
        "content": "자가제면으로 주문즉시 면을 뽑고. 명태식해, 양양들기름, 초당순두부, 까막장 등 강원도의 좋은 재료를 새롭게 재해석한 메뉴를 선보이는 강릉 메밀음식 전문점입니다.",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MThfMTUy%2FMDAxNzE2MDAxNjEyNzk5.h6DedVfbZvC5PfTAcM1bo9AdkrDUsujKWHChORL0upcg.oqtHFo-CLGz8Twgr_dMAZZWIX4hK_9V9vxPEy9gl60Qg.JPEG%2F20240518_113823.jpg.jpg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 5,
        "userId": 1
      },
      {
        "title": "김정옥할머니순두부",
        "content": "속초 친구 소개로 처음 방문해봤어요 순두부를 주문했는데 맛있어서 한그릇 뚝딱했습니다 굉장히 단백하고 고소한맛이 일품이더라구요 외식하면 속이 더부룩하기도 했는데 두부라 그런지 속이 편안하고 좋네요",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MjFfMTI2%2FMDAxNzE2MzAzMTIwNTE0.XXp5f-75ecfMs3Aa_F9e2c0_eNjcpb6MTk91JVtSp8Ug.0QZ4R8Rb2TiMw6L8g8uapmor87v4aBZjT4A_7A-GEBEg.JPEG%2F20240521_124439.jpg.jpg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 5,
        "userId": 2
      },
      {
        "title": "올래국수",
        "content": "제주도 가면 고기국수 한 그릇씩은 먹게 되는데 여태까지 먹은 고기국수집 중에 제일 맛있었어요! 돼지 잡내 없이 국물 깊고 진하고 넘나 맛있어요! 김치도 맛있어요 제주공항이랑도 가까워서 고기국수 한그릇 후딱 먹고가기 좋아요",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA2MDZfMTkx%2FMDAxNzE3NjczNzA0MDYx.EFZwfo1y3iC0KEcyWUTlKAbHLTI_31qQQR0kIFnTYuog.kSfPpG7d80wn7WpPvhVSqjs_kWHf6h1LHxruZ9pPLh4g.JPEG%2F2184F123-73B0-4519-82A7-037870ED3402.jpeg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 6,
        "userId": 1
      },
      {
        "title": "제주로움",
        "content": "제주로움 돈카츠 메뉴가 간단해서 좋네요 돈카츠 고기부드럽고 오징어먹물로 컽을 둘러싸고있어서 특이하고 맛있었어요 장소는 자그마한곳이라 아담하네요",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA1MDRfNTYg%2FMDAxNzE0NzUwNzYxMjM2.7t0nJBmSYmiNVby2J5WxfGE-5GG4XoIjh-adBCydYKAg.wvcYqFdi7ih5x56jZEzXvRAbiJ6R1J_31uXrY7mXE-Mg.JPEG%2F5182F76D-B8F2-48BB-BCC2-780E1A189BB0.jpeg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 6,
        "userId": 1
      },
      {
        "title": "제주의노을",
        "content": "고등어회는 비리지않고 딱새우도 싱싱한곳입니다 직원분들께서도 친절하시고 저흰 저녁에 방문했지만 낮에오셔도 뷰가 끝내줄거같습니다!",
        "imageUrl": ["https://search.pstatic.net/common/?src=https%3A%2F%2Fpup-review-phinf.pstatic.net%2FMjAyNDA2MDNfMjM4%2FMDAxNzE3Mzk4MjE1NTY0.abY6gFHQAadrkWeRmQsB-BJVGtJz9o0ONeY_Zpeb7Hgg.psF_TMrBFybDh4BxG8_sWIdaDCNQ22I0ULQ5gWSWCLog.JPEG%2F20240603_151822.jpg.jpg%3Ftype%3Dw1500_60_sharpen"],
        "regionId": 6,
        "userId": 2
      }
    ]

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
