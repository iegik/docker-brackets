NAME = docker-brackets
NODE_MODULES_DIR = node_modules

#ifdef USE_DOCKER
	DOCKER_NPM = docker run -it --rm \
		-v "$(CURDIR)":/usr/src/app \
		-w /usr/src/app \
		iegik/docker-node

	DOCKER_APP = docker run -it --rm \
		-p 3000:3000 \
		-v "$(CURDIR)":/usr/src/app \
		-v "$$HOME/Development":/usr/src/projects \
		-v "$$HOME/.ssh/known_hosts":/root/.ssh/known_hosts \
        -v $SSH_AUTH_SOCK:/tmp/ssh_agent \
        -e SSH_AUTH_SOCK=/tmp/ssh_agent \
		-w /usr/src/app \
		--name $(NAME) \
		iegik/docker-node

	DOCKER_RUN = docker exec -it \
		$(NAME) \

#endif

help:
	@echo "USAGE\n\n" \
		"dep		- Install dependencies.\n" \
		"build		- Build project.\n" \
		"clean		- Clean project.\n" \

.PHONY: dep build clean

$(NODE_MODULES_DIR): package.json
	@$(DOCKER_NPM) \
		npm install --unsafe-perm

dep: $(NODE_MODULES_DIR)

build: dep
	@$(DOCKER_APP) \
		npm start $(ARGS)

run\:%:
	@$(DOCKER_RUN) \
		$(subst run:,,$@) $(ARGS)

clean:
	@docker \
		rm -f $(NAME) && $(DOCKER_NPM) \
		rm -rf $(NODE_MODULES_DIR) brackets*
