.PHONY: install run build deploy clean

install: node_modules

node_modules: package.json $(wildcard pnpm-lock.yaml)
	@pnpm install
	@touch node_modules

run: node_modules
	@curl -s -o /dev/null localhost:5173 \
	  && echo "Already running on :5173" \
	  || pnpm dev

build: node_modules
	@pnpm build

deploy: build
	@pnpm exec wrangler deploy

clean:
	@rm -rf node_modules dist
