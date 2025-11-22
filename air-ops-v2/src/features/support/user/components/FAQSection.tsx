import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Collapse,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function FAQSection({ faqs = [] }: { faqs: FAQItem[] }) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestionId, setOpenQuestionId] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<FAQItem | null>(null);

  // Group FAQs by category
  const grouped = faqs.reduce((acc: any, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  console.log("opopenItem::", openItem);

  return (
    <>
      <Box sx={{ pr: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          FAQs
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Check common answers before raising a support request.
        </Typography>

        {/* CATEGORY ACCORDIONS */}
        {Object.keys(grouped).map((category) => {
          const expanded = openCategory === category;

          return (
            <Paper
              key={category}
              elevation={0}
              sx={{
                mb: 2,
                borderRadius: 2,
                p: 2,
                border: expanded ? "2px solid #7C3AED" : "1px solid #E5E7EB",
                bgcolor: expanded ? "#FAF7FF" : "white",
                transition: "0.2s",
              }}
            >
              {/* CATEGORY HEADER */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setOpenCategory((c) => (c === category ? null : category))
                }
              >
                <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
                  {category}
                </Typography>

                {/* category icon */}
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 2,
                    border: "1px solid #D1D5DB",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {expanded ? (
                    <RemoveIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <AddIcon sx={{ fontSize: 18 }} />
                  )}
                </Box>
              </Box>

              <Collapse in={expanded}>
                <Box sx={{ mt: 2 }}>
                  {grouped[category].map((faq) => {
                    const qOpen = openQuestionId === faq.id;

                    return (
                      <Paper
                        key={faq.id}
                        elevation={0}
                        sx={{
                          mb: 2,
                          borderRadius: 2,
                          p: 2,
                          border: "1px solid #E5E7EB",
                          bgcolor: "#FFFFFF",
                        }}
                      >
                        {/* QUESTION HEADER (Accordion) */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            setOpenQuestionId((id) =>
                              id === faq.id ? null : faq.id
                            )
                          }
                        >
                          <Typography sx={{ fontWeight: 600, fontSize: 15 }}>
                            {faq.question}
                          </Typography>

                          {/* question icon */}
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: 2,
                              border: "1px solid #D1D5DB",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {qOpen ? (
                              <RemoveIcon sx={{ fontSize: 17 }} />
                            ) : (
                              <AddIcon sx={{ fontSize: 17 }} />
                            )}
                          </Box>
                        </Box>

                        {/* QUESTION ANSWER PREVIEW + VIEW MORE */}
                        <Collapse in={qOpen}>
                          <Box sx={{ mt: 1 }}>
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#6B7280",
                                mt: 1,
                                mb: 1,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                              }}
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />

                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                color: "#7C3AED",
                                cursor: "pointer",
                                fontWeight: 500,
                                "&:hover": { textDecoration: "underline" },
                              }}
                              onClick={() => setOpenItem(faq)}
                            >
                              View more{" "}
                              <ArrowForwardIcon
                                sx={{ ml: 0.5, fontSize: 18 }}
                              />
                            </Box>
                          </Box>
                        </Collapse>
                      </Paper>
                    );
                  })}
                </Box>
              </Collapse>
            </Paper>
          );
        })}
      </Box>

      {/* DRAWER */}
      <Drawer
        anchor="right"
        open={!!openItem}
        onClose={() => setOpenItem(null)}
        PaperProps={{
          sx: {
            width: 640,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            zIndex: (theme) => theme.zIndex.modal + 10,
          },
        }}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 10,
        }}
      >
        {openItem && (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              p: 0,
            }}
          >
            {/* Header */}
            <Box
              sx={{
                bgcolor: "#F4F5F7",
                px: 2,
                py: 1.5,
                borderBottom: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
                {openItem.question}
              </Typography>

              <IconButton onClick={() => setOpenItem(null)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Scrollable content */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                px: 2,
                py: 2,
              }}
            >
              <Box
                sx={{
                  fontSize: 15,
                  color: "#374151",
                  lineHeight: 1.6,
                }}
                dangerouslySetInnerHTML={{
                  __html: openItem.answer,
                }}
              />
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  );
}
