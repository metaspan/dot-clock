import { ApiPromise, WsProvider } from '@polkadot/api';
import moment from 'moment-timezone'

const numberFormat = 'YYYY.MM.DD hh:mm:ss';

(async () => {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });
  const [updated, now] = await Promise.all([
    api.query.timestamp.didUpdate(),
    api.query.timestamp.now()
  ])

  // console.log(now.toHuman()) // 1,663,942,782,008
  // console.log(now.toString()) // 1663942782008
  console.log(updated.toString(), now.toString(), moment(Number(now.toString())).format(numberFormat))

  var i = 0
  // Retrieve the current timestamp via subscription
  const unsub = await api.query.timestamp.now((ts: any) => {
    console.log(`${i++} The last block has a timestamp of ${moment(Number(ts.toString())).format(numberFormat)}`)
    if (i > 10) process.exit(0)
  });


})()
