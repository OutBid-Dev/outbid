import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { REGISTER_OPTIONS } from "@/lib/app-data";
import { useLogin } from "../hooks/use-login";
import { type LoginFormValues, loginSchema } from "../schemas/login-schema";

function LoginPage() {
    const id = useId();
    const { login, isPending, isError, error, reset } = useLogin();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginFormValues) {
        reset();
        login(values);
    }

    return (
        <Card className="border-none bg-transparent pt-0 shadow-none ring-0 outline-none">
            <CardHeader className="border-b border-b-border px-0">
                <CardTitle className="text-xl font-bold">Login</CardTitle>
                <CardDescription className="text-sm">
                    Welcome back! Please enter your credentials to access your
                    account.
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-4">
                <div className="flex items-center justify-center">
                    <div className="flex flex-1 gap-8">
                        {REGISTER_OPTIONS.map((option) => (
                            <Button
                                key={option.id}
                                variant="outline"
                                className="flex flex-1 items-center justify-center gap-2 rounded-md"
                            >
                                <img
                                    src={option.icon}
                                    alt={option.name}
                                    className="h-5 w-5"
                                />
                                <span>Login with {option.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="mt-8 mb-3 flex items-center gap-6">
                    <hr className="flex-1 border-0 border-t border-border" />

                    <p className="text-center text-sm text-muted-foreground">
                        Or Continue with Email
                    </p>

                    <hr className="flex-1 border-0 border-t border-border" />
                </div>
                <form
                    id={`${id}-login-form`}
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="my-2 text-center">
                        {isError && (
                            <p
                                role="alert"
                                className="text-sm text-destructive"
                            >
                                {error?.message}
                            </p>
                        )}
                    </div>

                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor={`${id}-email`}>
                                Email
                            </FieldLabel>
                            <Input
                                id={`${id}-email`}
                                type="email"
                                placeholder="m@example.com"
                                required
                                aria-invalid={!!form.formState.errors.email}
                                {...form.register("email")}
                            />
                            {form.formState.errors.email && (
                                <FieldDescription>
                                    {form.formState.errors.email.message}
                                </FieldDescription>
                            )}
                        </Field>
                        <Field>
                            <div>
                                <FieldLabel htmlFor={`${id}-password`}>
                                    Password
                                </FieldLabel>
                                {/* <a
									href="/forgot-password"
									className="ml-auto text-xs underline-offset-2 hover:underline"
								>
									Forgot your password?
								</a> */}
                            </div>
                            <Input
                                id={`${id}-password`}
                                type="password"
                                required
                                aria-invalid={!!form.formState.errors.password}
                                {...form.register("password")}
                            />
                            {form.formState.errors.password && (
                                <FieldDescription>
                                    {form.formState.errors.password.message}
                                </FieldDescription>
                            )}
                        </Field>
                    </FieldGroup>
                </form>
                <div className="mt-4 flex items-center justify-end gap-2">
                    <Link to="/auth/register">
                        <Button
                            variant="link"
                            className="text-sm text-muted-foreground underline"
                        >
                            Don't have an account? Register
                        </Button>
                    </Link>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t-0 px-0">
                <Button
                    type="button"
                    variant="outline"
                    className="w-fit rounded-md border-dashed text-base"
                    onClick={() => {
                        form.reset();
                        reset();
                    }}
                >
                    Reset
                </Button>
                <Button
                    type="submit"
                    form={`${id}-login-form`}
                    size="lg"
                    className="v2-primary w-fit rounded-md text-base"
                    disabled={isPending || !form.formState.isValid}
                >
                    <span>
                        {isPending ? "Logging in" : "Let's get bidding"}
                    </span>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default LoginPage;
