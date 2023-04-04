import { Card,  Heading, LabelledValue, LinkButton, Text, HeroCarousel, ProgressBar, GeneralButton, ArrowLeft, ArrowRight, Display } from "@fluidity-money/surfing";
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
    <div>
      <LabelledValue label="EPOCH DAYS LEFT">
        20
      </LabelledValue>
      <div
        style={{
          display: 'flex',
          gap: '1em',
          alignItems: 'center',

        }}
      >
        <ProgressBar
          value={0.6}
          max={1}
          size='sm'
          rounded
          color="white"
        />
        <Text>60%</Text>
      </div>
    </div>
    <div>
      <LabelledValue label="REFERRALS">
        11
      </LabelledValue>
      <LinkButton
        color="gray"
        size="small"
        type="internal"
        handleClick={() => {
          return;
        }}
      >
        SEE DETAILS
      </LinkButton>
    </div>
    <div>
      <LabelledValue label="MY TOTAL BOTTLES">
        12
      </LabelledValue>
      <LinkButton
        color="gray"
        size="small"
        type="internal"
        handleClick={() => {
          return;
        }}
      >
        SEE DETAILS
      </LinkButton>
    </div>
  </div>;
}

const MultiplierTasks = () => {
  return <Card fill type="opaque" color="holo" border="none" rounded style={{zIndex: 0, color: 'black', flexDirection: 'row', alignItems: 'center', gap: '2em'}}>
    <div
      style={{display: 'flex', flexDirection: 'column', gap: '0.5em', alignItems: 'flex-start'}}
    >
      <Text style={{color: 'black'}} bold size="md">Multiplier Tasks</Text>
      <Text style={{color: 'black'}}>Perform displayed tasks to earn the respective multipliers.</Text>
    </div>
    <div>
      <Display size="sm" style={{color: 'black', margin: 0}} >1x</Display>
    </div>
    <div>
      <Text style={{color: 'black'}}>Perform any type of fAsset transactions <b>in any on-chain protocol</b>, including sending <b>with any wallet</b>.</Text>
    </div>
  </Card>
}

const MyMultiplier = () => {
  return <div
    style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '2em',
    }}
  >
    <div>
      <LabelledValue label="MY TOTAL LIQUIDITY MULTIPLIER">
        <Text size="xxl" holo>5,230x</Text>
      </LabelledValue>
    </div>
    <GeneralButton
        icon={<ArrowRight/>}
        buttontype="icon after"
        size="small"
        version="secondary"
        handleClick={() => {return}}
        style={{
          width: '100%',
          gridArea: '2 / 1',
          boxSizing: 'border-box',
          alignSelf: 'end',
        }}
      >
        MY STAKING STATS
      </GeneralButton>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto max-content',
        alignContent: 'start',
        gap: '1em',
        gridColumn: '2 / 3',
        gridRow: '1 / 3',
      }}
    >
      <div
        style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5em'}}
      >
        <Text>$5,000 FOR 365 DAYS</Text>
        <ProgressBar
          value={1}
          max={1}
          rounded
          color="holo"
          size='sm'
        />
      </div>
      <div style={{alignSelf: 'flex-end', marginBottom: '-0.2em'}}>
        <Text holo bold prominent>1X</Text>
      </div>
      <div
        style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5em'}}
      >
        <Text>$500 FOR 150 DAYS</Text>
        <ProgressBar
          value={0.5}
          max={1}
          rounded
          size='sm'
          color="gray"
        />
      </div>
      <div style={{alignSelf: 'flex-end', marginBottom: '-0.2em'}}>
        <Text>0.5X</Text>
      </div>
      <div
        style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5em'}}
      >
        <Text>$500 FOR 31 DAYS</Text>
        <ProgressBar
          value={0.05}
          max={1}
          rounded
          size='sm'
          color="gray"
        />
      </div>
      <div style={{alignSelf: 'flex-end', marginBottom: '-0.2em'}}>
        <Text>0.05X</Text>
      </div>
      <div
        style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5em'}}
      >
        <Text>$250 FOR 100 DAYS</Text>
        <ProgressBar
          value={0.05}
          max={1}
          rounded
          size='sm'
          color="gray"
        />
      </div>
      <div style={{alignSelf: 'flex-end', marginBottom: '-0.2em'}}>
        <Text>0.5X</Text>
      </div>
    </div>
    <GeneralButton 
      buttontype="text"
      size="medium"
      version="primary"
      handleClick={() => {return}}
      style={{width: '100%', boxSizing: 'border-box', gridColumn: '1 / 3', gridRow: '3 / 4'}}
    >
      STAKE NOW
    </GeneralButton>
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
            <Heading className={'no-margin'}>Welcome to Fluidity&apos;s Airdrop Event!</Heading>
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
