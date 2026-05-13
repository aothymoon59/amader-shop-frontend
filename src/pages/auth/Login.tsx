/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Button, Form, Input } from "antd";

import BrandLogo from "@/components/shared/BrandLogo";
import { toast } from "@/components/ui/use-toast";
import {
  type LoginRequestRole,
  useLoginMutation,
} from "@/redux/features/auth/authApi";
import { useAppDispatch } from "@/redux/hooks";
import {
  normalizeUserRole,
  roleMap,
  setUser,
} from "@/redux/features/auth/authSlice";

const getRedirectPath = (role: string) => {
  switch (normalizeUserRole(role)) {
    case roleMap.PROVIDER:
      return "/provider/dashboard";
    case roleMap.CUSTOMER:
      return "/";
    case roleMap.ADMIN:
      return "/admin/dashboard";
    case roleMap.SUPER_ADMIN:
      return "/super-admin/dashboard";
    default:
      return "/";
  }
};

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [selectedRole] = useState<LoginRequestRole>("CUSTOMER");
  const [login, { isLoading }] = useLoginMutation();

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || "/";

  const onFinish = async (values: LoginFormValues) => {
    try {
      const userInfo = {
        email: values.email,
        password: values.password,
        role: selectedRole,
      };

      const res = await login(userInfo).unwrap();
      const userRole = normalizeUserRole(res?.data?.user?.role);

      if (userRole !== roleMap.CUSTOMER && userRole !== roleMap.PROVIDER) {
        toast({
          title: "Access denied",
          description: "Only customers and providers can log in here",
          variant: "destructive",
        });
        return;
      }

      if (res?.success === true) {
        dispatch(
          setUser({
            user: res.data.user,
            token: res.data.accessToken,
          }),
        );

        toast({
          title: "Login successful",
          description: res.message || "You are now signed in.",
        });

        form.resetFields();

        navigate(from !== "/" ? from : getRedirectPath(userRole), {
          replace: true,
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description:
          error?.data?.errorMessage ||
          error?.data?.message ||
          "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex flex-1 gradient-hero items-center justify-center p-12">
        <div className="max-w-md text-center">
          <BrandLogo
            to="/"
            variant="logo"
            size="xl"
            className="mb-6 justify-center"
          />

          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "hsl(0,0%,100%)" }}
          >
            Welcome Back
          </h2>

          <p style={{ color: "hsl(220,14%,70%)" }}>
            Please enter your credentials to sign in as a customer or provider.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <BrandLogo
              to="/"
              size="md"
              className="mb-8 lg:hidden"
              nameClassName="text-foreground"
            />

            <h1 className="text-2xl font-bold">Sign In</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Enter your email and password to continue
            </p>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email address" },
              ]}
            >
              <Input placeholder="you@example.com" size="large" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                placeholder="Enter your password"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>

          <p className="text-xs text-center text-muted-foreground mt-3">
            <Link to="/admin/login" className="hover:underline">
              Admin and Super Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
