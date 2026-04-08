/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import { Store } from "lucide-react";
import { Button, Form, Input } from "antd";
import { toast } from "@/components/ui/use-toast";
import { useRegisterUserMutation } from "@/redux/features/auth/authApi";

type RegisterFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

const Register = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const onFinish = async (values: RegisterFormValues) => {
    try {
      const payload = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        role: "CUSTOMER",
      };

      const res = await registerUser(payload).unwrap();

      if (res?.success) {
        toast({
          title: "Registration successful",
          description: res.message || "Account created successfully",
        });

        form.resetFields();
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
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
          <Store className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h2
            className="text-3xl font-bold mb-4"
            style={{ color: "hsl(0,0%,100%)" }}
          >
            Join SmallShop
          </h2>
          <p style={{ color: "hsl(220,14%,70%)" }}>
            Create an account to start shopping or selling.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-1">Create Account</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Fill in your details to get started
          </p>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            {/* First + Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: "First name is required" }]}
              >
                <Input placeholder="John" size="large" />
              </Form.Item>

              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: "Last name is required" }]}
              >
                <Input placeholder="Doe" size="large" />
              </Form.Item>
            </div>

            {/* Email */}
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Enter a valid email" },
              ]}
            >
              <Input placeholder="you@example.com" size="large" />
            </Form.Item>

            {/* Password */}
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Password is required" },
                { min: 6, message: "Minimum 6 characters required" },
              ]}
            >
              <Input.Password placeholder="••••••••" size="large" />
            </Form.Item>

            {/* Submit */}
            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
