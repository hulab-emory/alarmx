import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import Label from '../../../common/Label';
import Tooltip from './Tooltip';

export default function TokenTable({ headers, tokens, otherTokens }) {

  return (
    <>
      <TableContainer component={Paper} sx={{ p: 2, width: "100%", backgroundColor: "transparent", overflow: "visible" }}>
        <Table size="small" aria-label="simple table" style={{ backgroundColor: "transparent" }}>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => {
                return <TableCell key={index} align={header.align}>
                  {header.label}
                </TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens?.tokens?.length > 0 ? (
              tokens.tokens.map((token, i) => {
                return (
                  <TableRow key={i} sx={{ background: otherTokens.tokens.filter(t => t.token === token.token).length > 0 ? "linear-gradient(90deg, rgba(2,0,36,0) 0%, rgba(230,255,240,0.5) 16%, rgba(230,255,240,0.8) 37%, rgba(230,255,240,0.8) 62%, rgba(230,255,240,0.5) 80%, rgba(0,212,255,0) 100%)" : "transparent" }}>
                    {headers.map((header, j) => {
                      if (header.name === 'rr') {
                        return (
                          <TableCell align="left" key={j} sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {token.referenceRange.trim() === "" ? "-" : token.referenceRange.trim()}
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell key={j} sx={{ maxWidth: '10%', width: "10%" }}>
                          {
                            header.name === 'tokens' ?
                              <Tooltip
                                tokenName={token.token.replace("_", " ")}
                                description={token.description.trim() || "No info"}
                                placement="right"
                              >
                                <Label
                                  color={otherTokens.tokens.filter(t => t.token === token.token).length > 0 ? 'success' : 'info'}
                                  sx={{
                                    userSelect: "none",
                                    textOverflow: 'ellipsis',
                                    maxWidth: 150,
                                    justifyContent: "left",
                                    overflow: 'hidden',
                                  }}>
                                  {token.token.replace("_", " ").substring(0, 20)}{token.token.length > 20 ? "..." : ""}
                                </Label>
                              </Tooltip> :
                              <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', WebkitLineClamp: 1, display: '-webkit-box', WebkitBoxOrient: 'vertical' }}>{token.source}</div>
                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : null}
          </TableBody>
        </Table>
        {/* <TablePagination
            rowsPerPageOptions={[5, 10, 20, 30]}
            component="div"
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
      </TableContainer>
    </>
  )
}
