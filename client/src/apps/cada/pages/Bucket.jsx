import React, { useEffect, useState } from "react";
import {
  Container,
  Breadcrumbs,
  IconButton,
} from "@mui/material";
import { connect } from "react-redux";
import { getBuckets } from "../redux/actions";
import { MdNavigateNext, MdHome } from "react-icons/md";
import BucketTable from "../sections/Bucket/BucketTable";

import { createTheme } from "@mui/material/styles";

const theme = createTheme();

// function groupBy(arr, property) {
//   console.log('groupby arr', arr)
//   return arr.reduce(function (memo, x) {
//     if (!memo[x[property]]) {
//       memo[x[property]] = [];
//     }
//     // (x.type === "dir" ||
//     //   ["adibin", "txt", "json", "undefined"].includes(x.path.split(".")[1])) &&
//       memo[x[property]].push(x);
//     return memo;
//   }, {});
// }

const sortPaths = (paths) => {
  // Helper function to extract numerical and string parts of a path for comparison
  const extractKey = (str) => str.match(/\d+|[^\d]+/g).map((chunk) => (isNaN(chunk) ? chunk : Number(chunk)));

  // Custom comparison for natural sorting
  const naturalCompare = (a, b) => {
    const aParts = extractKey(a);
    const bParts = extractKey(b);
    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      if (aParts[i] !== bParts[i]) {
        return typeof aParts[i] === "number" && typeof bParts[i] === "number"
          ? aParts[i] - bParts[i]
          : aParts[i].localeCompare(bParts[i]);
      }
    }
    return aParts.length - bParts.length;
  };

  return paths.sort((a, b) => {
    if (a.type === b.type) {
      return naturalCompare(a.path, b.path);
    }
    return a.type === "dir" ? -1 : 1;
  });
};

function Bucket({ buckets, getBuckets }) {
  const [path, setPath] = useState("");

  const handleClick = (name) => {
    setPath(path === "" ? name : `${path}/${name}`);
  };

  useEffect(() => {
    if (typeof buckets[path] === "undefined") {
      getBuckets(path);
    }
  }, [path]);

  const sortedPath =
    buckets[path]?.files && buckets[path]?.fileLength > 0 ?
      // groupBy(buckets[path].files, "type")
      sortPaths(buckets[path].files)
      : [];

  const handlePathClick = (idx) => () => {
    if (idx !== path.split("/").length - 1) {
      const newPath = path.split("/").slice(0, idx + 1).join("/");
      console.log('newPath', newPath)
      setPath(newPath);
    }
  };

  const handleAssignClick = (selectedFiles) => {

  }

  console.log(buckets)

  return (
    <>
      <div style={{ display: "flex" }}>
        {buckets && buckets?.[path]?.files && buckets[path]?.fileLength > 0 && (
          <Container maxWidth="lg" sx={{ mt: theme.spacing(5) }}>
            <Breadcrumbs
              sx={{ paddingBlock: 2 }}
              separator={<MdNavigateNext />}
              aria-label="breadcrumb"
            >
              <IconButton onClick={() => setPath("")}>
                <MdHome />
              </IconButton>
              {path !== "" ? path.split("/").map((p, idx) => <div className="path-title" key={idx} onClick={handlePathClick(idx)}> {p} </div>) : null}
            </Breadcrumbs>
            {sortedPath && (
              <BucketTable
                onAssignClick={(selectedFiles) => handleAssignClick(selectedFiles)}
                path={path}
                handleClickDir={handleClick}
                paths={buckets[path].files}
                fileLength={buckets[path]?.fileLength}
              />
            )}
          </Container>
        )}
      </div>
      <style>
        {`
          .path-title {
            user-select: none;
            cursor: pointer;
          }
        `}
      </style>
    </>


  );
}

const mapStateToProps = (state) => ({
  buckets: state.cada.buckets,
});

const mapDispatchToProps = (dispatch) => ({
  getBuckets: (subpath) => dispatch(getBuckets(subpath)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Bucket);
