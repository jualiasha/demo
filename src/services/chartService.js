import wretch from 'wretch';

export const fetchChartData = async () => {
  const accessKey = process.env.FC_API_KEY;
  return wretch(
    `https://fcsapi.com/api-v3/forex/history?id=1&period=4h&access_key=${accessKey}`
  )
    .headers({
      Accept: 'application/json',
    })
    .get()
    .json()
    .catch(error => {
      /* uncaught errors */
      console.error('Error fetching chart data: ', error);
    });
};
