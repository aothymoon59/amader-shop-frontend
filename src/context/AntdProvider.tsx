import { ConfigProvider } from "antd";

const AntdProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#356AF4",
        },

        components: {
          Table: {
            headerBg: "#356AF4",
            headerColor: "#fff",
            cellFontSize: 14,
            headerSortHoverBg: "#356AF4",
            headerSortActiveBg: "#356AF4",
          },
          Input: {
            activeBorderColor: "#356AF4",
            hoverBorderColor: "#356AF4",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
