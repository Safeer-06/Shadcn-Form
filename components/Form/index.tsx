"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// import useFormPersist from "react-hook-form-persist";

const publicationObject = z.object({
  link: z.string()
    .url("Invalid URL"),
  title: z.string(),
});

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email("Invalid email"),
  publications: z.array(publicationObject),
});

export function ProfileForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { formState } = form;
  const { errors } = formState;
  console.log("errors: ", errors);
  // const { watch, setValue } = form;

  // useFormPersist("storageKey", {
  //   watch,
  //   setValue,
  //   storage: window.localStorage, // default window.sessionStorage
  // });

  const { fields, append, remove } = useFieldArray({
    name: "publications",
    control: form.control,
  });

  const arrayValue = useWatch({
    name: "publications",
    control: form.control,
  });

  console.log("arrayValue: ", arrayValue);

  // const {
  //   fields: fields2,
  //   append: append2,
  //   remove: remove2,
  // } = useFieldArray({
  //   control: form.control, // control props comes from useForm (optional: if you are using FormProvider)
  //   name: "test", // unique name for your Field Array
  // });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Name</FormLabel>
              <FormControl>
                <Input placeholder="Doctor Name" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormDescription>This is your Email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <h1>Publications</h1>
        {fields.map((field, index) => (
          <div key={field.id}>
            <FormField
              control={form.control}
              name={`publications.${index}.link`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormDescription />
                  <FormControl>
                    <Input placeholder="Link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`publications.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormDescription />
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        ))}
        <div className="gap-2 flex">
          <Button
            onClick={() => {
              if (arrayValue?.length >= 3) {
                alert("Cannot add more than 3 fields");
                return;
              } else {
                append({ link: "", title: "" });
              }
            }}
          >
            + Add Field
          </Button>
          {!arrayValue?.length ? (
            <></>
          ) : (
            <Button onClick={() => remove(0)}>- Remove Field</Button>
          )}
        </div>
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
