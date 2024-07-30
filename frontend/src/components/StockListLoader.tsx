import ContentLoader from 'react-content-loader';

const StockListLoader = ({ theme }: { theme: string}) => (
    <ContentLoader
      width={425}
      height={157}
      animate={false}
      viewBox="0 0 450 160"
      title={"Loading stocks..."}
      backgroundColor={theme === "dark" ? '#666' : '#ccc'}
      foregroundColor={theme === "dark" ? '#333' : '#ddd'}
    >
      <rect x="10" y="15" rx="4" ry="4" width="250" height="25" />
      <rect x="310" y="15" rx="4" ry="4" width="100" height="25" />
      <rect x="10" y="50" rx="4" ry="4" width="400" height="15" />
      <rect x="10" y="75" rx="4" ry="4" width="125" height="62" />
      <rect x="145" y="75" rx="4" ry="4" width="130" height="62" />
      <rect x="285" y="75" rx="4" ry="4" width="125" height="62" />
      <rect x="5" y="155" rx="4" ry="4" width="410" height="2" />
    </ContentLoader>
  );


interface StockCardLoaderProps {
    theme: string;
};

const StockListLoaderContainer = ({ theme }: StockCardLoaderProps) => {


  const loaders = Array.from({ length: 5 }, (_, i) => (
    <StockListLoader key={i} theme={theme}/>
  ));

  return <div className="stock-list-loaders">{loaders}</div>;
};

export default StockListLoaderContainer;
