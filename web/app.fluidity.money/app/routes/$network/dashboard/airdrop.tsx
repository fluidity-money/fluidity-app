import { Card,  Heading, LabelledValue, LinkButton, Text, HeroCarousel } from "@fluidity-money/surfing";
import { Table } from "~/components";

const AirdropStats = () => {
  return <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
    }}
  >
    <LabelledValue label="EPOCH DAYS LEFT">
      20
    </LabelledValue>
    <LabelledValue label="REFERRALS">
      11
    </LabelledValue>
    <LabelledValue label="MY TOTAL BOTTLES">
      12
    </LabelledValue>
  </div>;
}

const MultiplierTasks = () => {
  return <Card fill type="holo" rounded style={{zIndex: 0, color: 'black'}}>
    <Text style={{color: 'black'}} bold size="lg">Multiplier Tasks</Text>
    <Text style={{color: 'black'}}>Perform displayed tasks to earn the respective multipliers.</Text>
  </Card>
}

const MyMultiplier = () => {
  return <div>

  </div>
}

const Leaderboard = () => {
  return <div className="pad-main">
    Leaderboard
  </div>;
}

const BottleProgress = () => {
  return <div>
    <HeroCarousel
      title="BOTTLES I'VE EARNED"
    >
      <Card
          type="frosted"
          fill
          shimmer
          rounded
        >
          <img src="/images/placeholderAirdrop1.png"/>
        </Card>
        <Card
          type="frosted"
          fill
          shimmer
          rounded
        >
          <img src="/images/placeholderAirdrop2.png"/>
        </Card>
                <Card
          type="frosted"
          fill
          shimmer
          rounded
        >
          <img src="/images/placeholderAirdrop3.png"/>
        </Card>
                <Card
          type="frosted"
          fill
          shimmer
          rounded
        >
         <img src="/images/placeholderAirdrop1.png"/>
        </Card>
        <Card
          type="frosted"
          fill
          shimmer
          rounded
        >
         <img src="/images/placeholderAirdrop2.png"/>
        </Card>
                <Card
          type="frosted"
          fill
          shimmer
          rounded
        >
         <img src="/images/placeholderAirdrop3.png"/>
        </Card>
    </HeroCarousel>
  </div>;
}

const Airdrop = () => {
  return (
    <>
      <div className="pad-main">
        <Text size="xl">Dashboard</Text>
      </div>
      <div className="pad-main">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr",
            gap: "10%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2em",
              zIndex: 1,
            }}
          >
            <Heading>Welcome to Fluidity&apos;s Airdrop Event!</Heading>
            <div>
              <Text>Vestibulum lobortis egestas luctus. Donec euismod nisi eu arcu vulputate, in pharetra nisl porttitor. Morbi aliquet vulputate metus, ac convallis lectus porttitor et. Donec maximus gravida mauris, eget tempor felis tristique sit amet. Pellentesque at hendrerit nibh, eu porttitor dui.
                <LinkButton
                  size="medium"
                  type="external"
                  handleClick={() => {
                    return;
                  }}
                >
                  Learn more
                </LinkButton>
              </Text>
            </div>
            <AirdropStats />
            <MultiplierTasks />
            <MyMultiplier />
          </div>
          <BottleProgress />
        </div>
      </div>
      <Leaderboard />
    </>
  );
}

export default Airdrop
