import React from "react";
import CustomContainer from "../../common/CustomContainer";
import MixoorBottomPart from "./mixoor-bottom-part/MixoorBottomPart";
import MixoorMiddlePart from "./mixoor-middle-part/MixoorMiddlePart";
import MixoorTopPart from "./mixoor-top-part/MixoorTopPart";

export default function MixoorContent() {
  return (
    <CustomContainer
      width={"100%"}
      p={"$5"}
      display={"flex"}
      flexDirection={"column"}
      self={"flex-start"}
      gap={"$7"}
    >
      {/* Top Part */}
      <MixoorTopPart />

      {/* Middle Part */}
      <MixoorMiddlePart />

      {/* Bottom Part */}
      <MixoorBottomPart />
    </CustomContainer>
  );
}
