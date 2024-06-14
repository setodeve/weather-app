import React, { useEffect, useState } from 'react';
import { Grid, GridItem, Heading, VStack } from "@yamada-ui/react"

const styles = {
  container: {
    width: '70%',
    margin: '0 auto',
  },
  city:{
    margin: '20px 0'
  }
};

type KeyObject = {
  [key: string]: string[]
}

const Region = () => {
  const [data, setData] = useState<KeyObject | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/pref.json');
      const result = await res.json();
      setData(result);
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div style={styles.container}>
      {
        data ? Object.keys(data).map((key) => {
          return (
            <VStack key={key+"VStack"}>
              <Heading key={key+"Heading"}>{key}</Heading>
              <Grid templateColumns="repeat(10, 2fr)" gap="md" key={key} style={styles.city}>
                {
                  data[key].map((d:string) => {
                    return (
                      <GridItem key={d}>
                        {d}
                      </GridItem>
                    )
                  })
                }
              </Grid>
            </VStack>
          )
        })
        :null
      }
    </div>
  )
};

export default Region