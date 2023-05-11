import wretch from 'wretch';

export const fetchChartData = async id => {
  const accessKey = process.env.STORYBOOK_FC_API_KEY;
  return wretch(
    `https://fcsapi.com/api-v3/forex/history?id=${id}&period=4h&access_key=${accessKey}`
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
