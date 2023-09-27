import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Loader = () => {
  return (
    <>
      <tr>
        <td width={"25%"}>
          <Skeleton count={5} height={85} />
        </td>
        <td width={"25%"}>
          <Skeleton count={5} height={85} />
        </td>
        <td width={"50%"}>
          <Skeleton count={5} height={85} />
        </td>
      </tr>
    </>
  );
};

export default Loader;
