import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
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
import { useRegister } from "../hooks/use-register";
import {
    type RegisterFormValues,
    registerSchema,
} from "../schemas/register-schema";

function RegisterPage() {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const { register, isPending, isError, error, reset } = useRegister();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: RegisterFormValues) {
        reset();
        register(values);
    }

    return (
        <Card className="border-none bg-transparent pt-0 shadow-none ring-0 outline-none">
            <CardHeader className="border-b border-b-border px-0">
                <CardTitle className="text-xl font-bold">Register</CardTitle>
                <CardDescription className="text-sm">
                    Create an account to get started with our services.
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
                                <span>Register with {option.name}</span>
                            </Button>
                        ))}
                    </div>
                </div>
                <div className="my-8 flex items-center gap-6">
                    <hr className="flex-1 border-0 border-t border-border" />

                    <p className="text-center text-sm text-muted-foreground">
                        Or Continue with Email
                    </p>

                    <hr className="flex-1 border-0 border-t border-border" />
                </div>
                <form
                    id={`${id}-register-form`}
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
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel htmlFor={`${id}-first-name`}>
                                    First Name
                                </FieldLabel>
                                <Input
                                    id={`${id}-first-name`}
                                    placeholder="John"
                                    required
                                    aria-invalid={
                                        !!form.formState.errors.firstName
                                    }
                                    {...form.register("firstName")}
                                />
                                {form.formState.errors.firstName && (
                                    <FieldDescription>
                                        {
                                            form.formState.errors.firstName
                                                .message
                                        }
                                    </FieldDescription>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor={`${id}-last-name`}>
                                    Last Name
                                </FieldLabel>
                                <Input
                                    id={`${id}-last-name`}
                                    placeholder="Doe"
                                    required
                                    aria-invalid={
                                        !!form.formState.errors.lastName
                                    }
                                    {...form.register("lastName")}
                                />
                                {form.formState.errors.lastName && (
                                    <FieldDescription>
                                        {form.formState.errors.lastName.message}
                                    </FieldDescription>
                                )}
                            </Field>
                        </div>
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
                            <FieldLabel htmlFor={`${id}-password`}>
                                Password
                            </FieldLabel>
                            <Input
                                id={`${id}-password`}
                                type="password"
                                required
                                aria-invalid={!!form.formState.errors.password}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
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
                    <Link to="/auth/login">
                        <Button
                            variant="link"
                            className="text-sm text-muted-foreground underline"
                        >
                            Already have an account? Login
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
                    form={`${id}-register-form`}
                    size="lg"
                    className="v2-primary w-fit rounded-md text-base"
                    disabled={isPending || !form.formState.isValid}
                >
                    <span>
                        {isPending ? "Signing up..." : "Start your journey"}
                    </span>
                </Button>
            </CardFooter>
        </Card>
    );
}

export default RegisterPage;
